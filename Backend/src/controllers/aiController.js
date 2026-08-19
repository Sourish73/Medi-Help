const Groq = require('groq-sdk');
const DoctorProfile = require('../models/DoctorProfile');
const Slot = require('../models/Slot');
const User = require('../models/User');
require('dotenv').config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Lightweight In-Memory Caches to drastically reduce API calls and latency
const summaryCache = new Map();
const checklistCache = new Map();

const getDoctorSummary = async (req, res) => {
  try {
    const { doctorId } = req.params;

    if (summaryCache.has(doctorId)) {
      return res.status(200).json({ success: true, data: summaryCache.get(doctorId), cached: true });
    }

    const doctorProfile = await DoctorProfile.findOne({ user: doctorId }).populate('user', 'name');
    if (!doctorProfile) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    const prompt = `Write a polished, professional 2-sentence patient-facing bio summary for ${doctorProfile.user.name}. They specialize in ${doctorProfile.specialization} with ${doctorProfile.experience} years of experience and hold qualifications: ${doctorProfile.qualifications.join(', ')}. Emphasize trust and expertise. Do not use quotes or introductory text, just return the 2 sentences.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'qwen/qwen3.6-27b',
      temperature: 0.5,
    });

    const aiSummary = chatCompletion.choices[0]?.message?.content?.trim();
    summaryCache.set(doctorId, aiSummary);

    res.status(200).json({ success: true, data: aiSummary, cached: false });
  } catch (error) {
    console.error('Error generating summary:', error);
    res.status(500).json({ success: false, message: 'AI generation failed' });
  }
};

const getChecklist = async (req, res) => {
  try {
    const { specialization } = req.params;

    if (checklistCache.has(specialization)) {
      return res.status(200).json({ success: true, data: checklistCache.get(specialization), cached: true });
    }

    const prompt = `Provide exactly 3 short, actionable bullet points on how a patient should prepare for an upcoming appointment with a ${specialization}. Format as a JSON array of strings. Example: ["Fast for 8 hours", "Bring previous X-rays", "Wear loose clothing"]. Only return valid JSON array, no markdown wrappers, no introductory text.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'qwen/qwen3.6-27b',
      temperature: 0.3,
    });

    let checklist = [];
    try {
      const responseText = chatCompletion.choices[0]?.message?.content?.trim();
      checklist = JSON.parse(responseText.replace(/```json/g, '').replace(/```/g, ''));
    } catch (e) {
      // Fallback if LLM fails to format JSON strictly
      checklist = ["Bring your ID and medical records", "Arrive 15 minutes early", "Prepare a list of your current medications"];
    }

    checklistCache.set(specialization, checklist);
    res.status(200).json({ success: true, data: checklist, cached: false });
  } catch (error) {
    console.error('Error generating checklist:', error);
    res.status(500).json({ success: false, message: 'AI generation failed' });
  }
};

// Agentic Chatbot Logic
const chatAgent = async (req, res) => {
  try {
    const { messages } = req.body; // Array of {role, content}
    
    const tools = [
      {
        type: 'function',
        function: {
          name: 'search_doctors',
          description: 'Search for doctors based on a medical specialty or specialization (e.g. Cardiology, Dermatology).',
          parameters: {
            type: 'object',
            properties: {
              specialty: {
                type: 'string',
                description: 'The medical specialty to search for (e.g. Cardiology)'
              }
            },
            required: ['specialty']
          }
        }
      }
    ];

    // Add System prompt to ensure medical compliance and tone
    const systemPrompt = {
      role: 'system',
      content: 'You are an AI booking assistant for MediSlot Hospital. Be polite, concise, and helpful. Use the search_doctors tool to find doctors when the user asks for a specific specialty. If they want to book, direct them to click "Book A Appointment" in the navbar.'
    };

    const apiMessages = [systemPrompt, ...messages];

    let chatCompletion = await groq.chat.completions.create({
      model: 'qwen/qwen3.6-27b',
      messages: apiMessages,
      tools: tools,
      tool_choice: 'auto'
    });

    let responseMessage = chatCompletion.choices[0].message;

    // Handle Function Calling
    if (responseMessage.tool_calls) {
      apiMessages.push(responseMessage); // Add assistant's tool call to history
      
      for (const toolCall of responseMessage.tool_calls) {
        if (toolCall.function.name === 'search_doctors') {
          const args = JSON.parse(toolCall.function.arguments);
          
          // Actually hit our DB
          const doctors = await DoctorProfile.find({ 
            specialization: { $regex: new RegExp(args.specialty, 'i') } 
          }).populate('user', 'name').limit(3);
          
          const doctorList = doctors.map(d => `Dr. ${d.user.name} (Fee: ₹${d.fees})`).join(', ');
          const toolResult = doctorList.length > 0 ? `Found: ${doctorList}` : `No doctors found for ${args.specialty}`;

          apiMessages.push({
            tool_call_id: toolCall.id,
            role: 'tool',
            name: 'search_doctors',
            content: toolResult
          });
        }
      }

      // Get final response after tool results
      chatCompletion = await groq.chat.completions.create({
        model: 'qwen/qwen3.6-27b',
        messages: apiMessages
      });
      responseMessage = chatCompletion.choices[0].message;
    }

    let finalContent = responseMessage.content || '';
    // Qwen models often output chain-of-thought inside <think> tags. Strip them out for a clean UI.
    finalContent = finalContent.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

    res.status(200).json({ success: true, message: finalContent });
  } catch (error) {
    console.error('Error in AI Chat Agent:', error);
    res.status(500).json({ success: false, message: 'AI chat failed' });
  }
};

module.exports = {
  getDoctorSummary,
  getChecklist,
  chatAgent
};
