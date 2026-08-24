const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const email = 'admin@medislot.com';
    let admin = await User.findOne({ email });

    if (!admin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('adminpassword123', salt);

      await User.create({
        name: 'System Administrator',
        email: email,
        password: hashedPassword,
        phone: '9999999999',
        role: 'admin'
      });
      console.log('Admin account created successfully!');
    } else {
      console.log('Admin account already exists.');
    }
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
}

seed();
