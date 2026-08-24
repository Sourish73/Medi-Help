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
  { name: 'Dr. Arun Prasad', email: 'arun.prasad@medislot.com', specialization: 'Cardiology', fees: 1100 },
  { name: 'Dr. Divya Nair', email: 'divya.nair@medislot.com', specialization: 'Dermatology', fees: 850 },
  { name: 'Dr. Manoj H', email: 'manoj.h@medislot.com', specialization: 'Neurology', fees: 1250 },
  { name: 'Dr. Ritu Saxena', email: 'ritu.saxena@medislot.com', specialization: 'Pediatrics', fees: 750 },
  { name: 'Dr. Harish K', email: 'harish.k@medislot.com', specialization: 'Orthopedics', fees: 950 },
  { name: 'Dr. Shalini S', email: 'shalini.s@medislot.com', specialization: 'Psychiatry', fees: 1150 },
  { name: 'Dr. Vijay K', email: 'vijay.k@medislot.com', specialization: 'Gastroenterology', fees: 1000 },
  { name: 'Dr. Pooja M', email: 'pooja.m@medislot.com', specialization: 'Endocrinology', fees: 900 },
  { name: 'Dr. Deepak T', email: 'deepak.t@medislot.com', specialization: 'Oncology', fees: 1600 },
  { name: 'Dr. Kiran P', email: 'kiran.p@medislot.com', specialization: 'General Surgery', fees: 1400 },
  { name: 'Dr. Suresh R', email: 'suresh.r@medislot.com', specialization: 'Cardiology', fees: 1150 },
  { name: 'Dr. Meera J', email: 'meera.j@medislot.com', specialization: 'Dermatology', fees: 900 },
  { name: 'Dr. Nitin C', email: 'nitin.c@medislot.com', specialization: 'Neurology', fees: 1300 },
  { name: 'Dr. Sunita B', email: 'sunita.b@medislot.com', specialization: 'Pediatrics', fees: 800 },
  { name: 'Dr. Alok V', email: 'alok.v@medislot.com', specialization: 'Orthopedics', fees: 1000 },
  { name: 'Dr. Rashmi D', email: 'rashmi.d@medislot.com', specialization: 'Psychiatry', fees: 1200 },
  { name: 'Dr. Anil G', email: 'anil.g@medislot.com', specialization: 'Gastroenterology', fees: 1050 },
  { name: 'Dr. Preeti S', email: 'preeti.s@medislot.com', specialization: 'Endocrinology', fees: 950 },
  { name: 'Dr. Rajiv N', email: 'rajiv.n@medislot.com', specialization: 'Oncology', fees: 1650 },
  { name: 'Dr. Geeta K', email: 'geeta.k@medislot.com', specialization: 'General Surgery', fees: 1450 }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    for (const doc of doctorsData) {
      let user = await User.findOne({ email: doc.email });
      if (!user) {
        user = await User.create({
          name: doc.name,
          email: doc.email,
          password: hashedPassword,
          phone: '9876543210',
          role: 'doctor'
        });

        await DoctorProfile.create({
          user: user._id,
          specialization: doc.specialization,
          experienceYears: Math.floor(Math.random() * 15) + 5,
          fees: doc.fees,
          slotDurationMinutes: 30,
          workingHours: { start: '09:00', end: '17:00' },
          leaveDays: []
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
