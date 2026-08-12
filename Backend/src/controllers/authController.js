const User = require('../models/User');
const DoctorProfile = require('../models/DoctorProfile');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || 'your_super_secret_jwt_key_here';
  
  const token = jwt.sign({ id }, secret, { expiresIn: '7d' });
  console.log('Generated Token:', token);
  return token;
};

const register = async (req, res) => {
  try {
    const { name, email, password, role, phone, specialization, fees, experienceYears } = req.body;

    // 1. Check if user exists in core User collection
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create User
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'patient',
      phone,
    });

    // 4. Create Doctor Profile if role is doctor
    let doctorProfile = null;
    if (user.role === 'doctor') {
      doctorProfile = await DoctorProfile.create({
        user: user._id,
        specialization: specialization || 'General Physician',
        fees: fees || 500,
        experienceYears: experienceYears || 0,
      });
    }

    // 5. Generate Token and Respond
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        doctorProfile: doctorProfile ? doctorProfile._id : null,
        token,
      },
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    let doctorProfile = null;
    if (user.role === 'doctor') {
      doctorProfile = await DoctorProfile.findOne({ user: user._id });
    }

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        doctorProfile: doctorProfile ? doctorProfile._id : null,
        token,
      },
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login };