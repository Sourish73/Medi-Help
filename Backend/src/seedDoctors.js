const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const DoctorProfile = require('./models/DoctorProfile');
require('dotenv').config();

const doctorsData = [
  { name: 'Dr. Rajesh Sharma', email: 'rajesh.sharma@medislot.com', specialization: 'Cardiology', fees: 1000 },
  { name: 'Dr. Priya Patel', email: 'priya.patel@medislot.com', specialization: 'Dermatology', fees: 800 },
  { name: 'Dr. Amit Kumar', email: 'amit.kumar@medislot.com', specialization: 'Neurology', fees: 1200 },
  { name: 'Dr. Sneha Desai', email: 'sneha.desai@medislot.com', specialization: 'Pediatrics', fees: 700 },
  { name: 'Dr. Vikram Singh', email: 'vikram.singh@medislot.com', specialization: 'Orthopedics', fees: 900 },
  { name: 'Dr. Anjali Gupta', email: 'anjali.gupta@medislot.com', specialization: 'Psychiatry', fees: 1100 },
  { name: 'Dr. Ramesh Iyer', email: 'ramesh.iyer@medislot.com', specialization: 'Gastroenterology', fees: 950 },
  { name: 'Dr. Kavita Reddy', email: 'kavita.reddy@medislot.com', specialization: 'Endocrinology', fees: 850 },
  { name: 'Dr. Sanjay Verma', email: 'sanjay.verma@medislot.com', specialization: 'Oncology', fees: 1500 },
  { name: 'Dr. Neha Joshi', email: 'neha.joshi@medislot.com', specialization: 'General Surgery', fees: 1300 },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    for (const doc of doctorsData) {
      // Check if exists
      let user = await User.findOne({ email: doc.email });
      if (!user) {
        user = await User.create({
          name: doc.name,
          email: doc.email,
          password: hashedPassword,
          phone: '1234567890',
          role: 'doctor'
        });

        await DoctorProfile.create({
          user: user._id,
          specialization: doc.specialization,
          experience: Math.floor(Math.random() * 15) + 5,
          qualifications: ['MBBS', 'MD'],
          clinicAddress: 'MediSlot Central Hospital',
          fees: doc.fees,
          slotDurationMinutes: 30
        });
        console.log(`Created doctor: ${doc.name}`);
      } else {
        console.log(`Doctor already exists: ${doc.name}`);
      }
    }
    
    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seed();
