const nodemailer = require('nodemailer');
const https = require('https');

const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
      port: parseInt(process.env.SMTP_PORT || '2525'),
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'no-reply@medislot.com',
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error('Email notification failed to send:', error.message);
  }
};

const handleCalendarEvent = async (action, appointment, doctorUser, patientUser) => {
  try {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      console.log(`Mocking Google Calendar ${action} for appointment ${appointment._id}`);
      return 'mock_event_id_' + Date.now();
    }

    const payload = JSON.stringify({
      summary: `Medical Consultation - Dr. ${doctorUser.name} & ${patientUser.name}`,
      description: `Appointment with doctor specializing in ${appointment.symptoms || 'General Consult'}.`,
      start: { dateTime: appointment.slot.startTime },
      end: { dateTime: appointment.slot.endTime },
    });

    const requestOptions = {
      hostname: 'www.googleapis.com',
      path: '/calendar/v3/calendars/primary/events',
      method: action === 'CREATE' ? 'POST' : 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GOOGLE_OAUTH_TOKEN}`,
      },
    };

    return new Promise((resolve) => {
      const req = https.request(requestOptions, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
          try {
            const data = JSON.parse(body);
            resolve(data.id || 'api_event_id_' + Date.now());
          } catch {
            resolve('fail_event_id_' + Date.now());
          }
        });
      });
      req.on('error', () => {
        resolve('fail_event_id_' + Date.now());
      });
      req.write(payload);
      req.end();
    });
  } catch (error) {
    console.error('Google Calendar integration failed:', error.message);
    return 'fallback_event_id_' + Date.now();
  }
};

module.exports = {
  sendEmail,
  handleCalendarEvent,
};
