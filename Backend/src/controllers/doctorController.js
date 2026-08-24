const DoctorProfile = require('../models/DoctorProfile');
const User = require('../models/User');
const Slot = require('../models/Slot');
const Appointment = require('../models/Appointment');
const bcrypt = require('bcryptjs');
const { sendEmail, handleCalendarEvent } = require('../utils/notificationService');

const handleLeaveConflict = async (doctorId, leaveDateStr) => {
  const startOfDay = new Date(`${leaveDateStr}T00:00:00.000Z`);
  const endOfDay = new Date(`${leaveDateStr}T23:59:59.999Z`);

  const slots = await Slot.find({
    doctor: doctorId,
    startTime: { $gte: startOfDay, $lte: endOfDay }
  });

  const slotIds = slots.map(s => s._id);

  const appointments = await Appointment.find({
    doctor: doctorId,
    slot: { $in: slotIds },
    status: { $in: ['PENDING', 'CONFIRMED'] }
  }).populate('patient').populate('slot').populate('doctor');

  for (const apt of appointments) {
    apt.status = 'CANCELLED';
    await apt.save();

    await Slot.findByIdAndUpdate(apt.slot._id, { status: 'AVAILABLE' });

    if (apt.calendarEventId) {
      await handleCalendarEvent('DELETE', apt, apt.doctor, apt.patient);
    }

    await sendEmail(
      apt.patient.email,
      'Appointment Cancelled - Doctor Leave',
      `<h1>Appointment Cancelled</h1><p>Dear ${apt.patient.name}, Dr. ${apt.doctor.name} is on leave on ${leaveDateStr}. Your appointment has been cancelled and refunded.</p>`
    );
  }
};

const updateProfile = async (req, res) => {
  try {
    const { specialization, fees, experienceYears, bio, slotDurationMinutes, workingHours, leaveDays } = req.body;

    let profile = await DoctorProfile.findOne({ user: req.user._id });

    const originalLeaves = profile ? profile.leaveDays || [] : [];
    const newLeaves = leaveDays || [];

    const addedLeaves = newLeaves.filter(day => !originalLeaves.includes(day));

    const profileFields = {
      user: req.user._id,
      specialization,
      fees,
      experienceYears,
      bio,
      slotDurationMinutes: slotDurationMinutes || 30,
      workingHours: workingHours || { start: '09:00', end: '17:00' },
      leaveDays: leaveDays || [],
    };

    if (profile) {
      profile = await DoctorProfile.findOneAndUpdate(
        { user: req.user._id },
        { $set: profileFields },
        { returnDocument: 'after' }
      );
    } else {
      profile = await DoctorProfile.create(profileFields);
    }

    for (const leaveDay of addedLeaves) {
      await handleLeaveConflict(req.user._id, leaveDay);
    }

    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllDoctors = async (req, res) => {
  try {
    const { specialization } = req.query;
    let query = { isAvailable: true };

    if (specialization) {
      query.specialization = { $regex: specialization, $options: 'i' };
    }

    const doctors = await DoctorProfile.find(query).populate({
      path: 'user',
      select: 'name email phone',
    });

    res.status(200).json({ success: true, count: doctors.length, data: doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getDoctorById = async (req, res) => {
  try {
    const doctor = await DoctorProfile.findById(req.params.id).populate({
      path: 'user',
      select: 'name email phone',
    });

    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor profile not found' });
    }

    res.status(200).json({ success: true, data: doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const changeAvailability = async (req, res) => {
  try {
    const doctorProfile = await DoctorProfile.findOne({ user: req.user._id });

    if (!doctorProfile) {
      return res.status(404).json({ success: false, message: 'Doctor profile not found' });
    }

    doctorProfile.isAvailable = !doctorProfile.isAvailable;
    await doctorProfile.save();

    res.status(200).json({
      success: true,
      message: `Availability changed to ${doctorProfile.isAvailable}`,
      data: { isAvailable: doctorProfile.isAvailable },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const doctorDashboard = async (req, res) => {
  try {
    const doctorProfile = await DoctorProfile.findOne({ user: req.user._id });
    if (!doctorProfile) {
      return res.status(404).json({ success: false, message: 'Doctor profile not found' });
    }

    const totalAppointments = await Appointment.countDocuments({ doctor: req.user._id });
    const completedAppointments = await Appointment.countDocuments({
      doctor: req.user._id,
      status: 'COMPLETED',
    });

    const earningsResult = await Appointment.aggregate([
      { $match: { doctor: req.user._id, paymentStatus: 'PAID' } },
      { $group: { _id: null, totalEarnings: { $sum: '$amount' } } },
    ]);

    const totalEarnings = earningsResult.length > 0 ? earningsResult[0].totalEarnings : 0;

    res.status(200).json({
      success: true,
      data: {
        totalAppointments,
        completedAppointments,
        totalEarnings,
        isAvailable: doctorProfile.isAvailable,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const adminCreateDoctor = async (req, res) => {
  try {
    const { name, email, password, phone, specialization, fees, experienceYears, workingHours, slotDurationMinutes, leaveDays } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'doctor',
      phone,
    });

    const doctorProfile = await DoctorProfile.create({
      user: user._id,
      specialization: specialization || 'General Physician',
      fees: fees || 500,
      experienceYears: experienceYears || 0,
      workingHours: workingHours || { start: '09:00', end: '17:00' },
      slotDurationMinutes: slotDurationMinutes || 30,
      leaveDays: leaveDays || [],
    });

    res.status(201).json({ success: true, data: { user, doctorProfile } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const adminUpdateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, specialization, fees, experienceYears, workingHours, slotDurationMinutes, leaveDays } = req.body;

    const profile = await DoctorProfile.findById(id);
    if (!profile) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    const originalLeaves = profile.leaveDays || [];
    const newLeaves = leaveDays || [];
    const addedLeaves = newLeaves.filter(day => !originalLeaves.includes(day));

    await User.findByIdAndUpdate(profile.user, { name, email, phone });

    profile.specialization = specialization;
    profile.fees = fees;
    profile.experienceYears = experienceYears;
    profile.workingHours = workingHours || profile.workingHours;
    profile.slotDurationMinutes = slotDurationMinutes || profile.slotDurationMinutes;
    profile.leaveDays = leaveDays || [];
    await profile.save();

    for (const leaveDay of addedLeaves) {
      await handleLeaveConflict(profile.user, leaveDay);
    }

    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const adminGetDoctors = async (req, res) => {
  try {
    const profiles = await DoctorProfile.find().populate('user');
    res.status(200).json({ success: true, data: profiles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const adminDeleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await DoctorProfile.findById(id);
    if (!profile) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    await User.findByIdAndDelete(profile.user);
    await DoctorProfile.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: 'Doctor deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  updateProfile,
  getAllDoctors,
  getDoctorById,
  changeAvailability,
  doctorDashboard,
  adminCreateDoctor,
  adminUpdateDoctor,
  adminGetDoctors,
  adminDeleteDoctor,
};