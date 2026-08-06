const DoctorProfile = require('../models/DoctorProfile');
const User = require('../models/User');
const Slot = require('../models/Slot');
const Appointment = require('../models/Appointment');


const updateProfile = async (req, res) => {
  try {
    const { specialization, fees, experienceYears, bio, slotDurationMinutes } = req.body;

    const profileFields = {
      user: req.user._id,
      specialization,
      fees,
      experienceYears,
      bio,
      slotDurationMinutes: slotDurationMinutes || 30,
    };

    let profile = await DoctorProfile.findOne({ user: req.user._id });

    if (profile) {
      profile = await DoctorProfile.findOneAndUpdate(
        { user: req.user._id },
        { $set: profileFields },
        { new: true }
      );
      return res.status(200).json({ success: true, data: profile });
    }

    profile = await DoctorProfile.create(profileFields);
    res.status(201).json({ success: true, data: profile });
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

// Toggle Doctor Availability
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

    // 1. Total Appointments assigned to this doctor
    const totalAppointments = await Appointment.countDocuments({ doctor: req.user._id });

    // 2. Completed Appointments
    const completedAppointments = await Appointment.countDocuments({
      doctor: req.user._id,
      status: 'COMPLETED',
    });

    // 3. Total Earnings (Sum of paid appointments)
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

module.exports = {
  updateProfile,
  getAllDoctors,
  getDoctorById,
  changeAvailability,
  doctorDashboard,
};