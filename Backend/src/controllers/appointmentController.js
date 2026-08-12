const Appointment = require('../models/Appointment');
const Slot = require('../models/Slot');
const DoctorProfile = require('../models/DoctorProfile');
const { generateAvailableSlots } = require('../utils/slotCalculator');


const getAvailableSlots = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query; //  YYYY-MM-DD

    if (!date) {
      return res.status(400).json({ success: false, message: 'Date parameter is required' });
    }

    const doctorProfile = await DoctorProfile.findOne({ user: doctorId });
    if (!doctorProfile) {
      return res.status(404).json({ success: false, message: 'Doctor profile not found' });
    }

    // Working Window
    const shiftStart = new Date(`${date}T09:00:00.000Z`);
    const shiftEnd = new Date(`${date}T17:00:00.000Z`);

    // Targeted Date fetch Data
    const startOfDay = new Date(`${date}T00:00:00.000Z`);
    const endOfDay = new Date(`${date}T23:59:59.999Z`);

    const existingSlots = await Slot.find({
      doctor: doctorId,
      startTime: { $gte: startOfDay, $lte: endOfDay },
      status: { $in: ['BOOKED', 'LOCKED'] },
    });

    
    const availableSlots = generateAvailableSlots(
      shiftStart,
      shiftEnd,
      existingSlots,
      doctorProfile.slotDurationMinutes || 30
    );

    res.status(200).json({
      success: true,
      count: availableSlots.length,
      data: availableSlots,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const bookAppointment = async (req, res) => {
  try {
    const { doctorId, startTime, endTime } = req.body;

    const doctorProfile = await DoctorProfile.findOne({ user: doctorId });
    if (!doctorProfile) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    
    let slot = await Slot.findOneAndUpdate(
      {
        doctor: doctorId,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        status: { $ne: 'BOOKED' }, // Race condition guard: ensures slot isn't already booked
      },
      {
        $set: {
          status: 'BOOKED',
          lockedBy: req.user._id,
        },
      },
      { new: true, upsert: true }
    );

    // Create the associated appointment record
    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor: doctorId,
      slot: slot._id,
      amount: doctorProfile.fees,
      status: 'CONFIRMED',
      paymentStatus: 'PAID', 
    });

    res.status(201).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
   
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'This slot was just booked by another user. Please choose a different time.',
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};


const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctor: req.user._id })
      .populate('patient', 'name email phone')
      .populate('slot')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const getPatientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user._id })
      .populate('doctor', 'name email phone')
      .populate('slot')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Authorization check
    if (
      appointment.patient.toString() !== req.user._id.toString() &&
      appointment.doctor.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this appointment' });
    }

    appointment.status = 'CANCELLED';
    await appointment.save();

    // Release the corresponding slot so it becomes available again
    await Slot.findByIdAndUpdate(appointment.slot, {
      status: 'AVAILABLE',
      lockedBy: null,
    });

    res.status(200).json({ success: true, message: 'Appointment cancelled and slot released', data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const completeAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    if (appointment.doctor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to perform this action' });
    }

    appointment.status = 'COMPLETED';
    await appointment.save();

    res.status(200).json({ success: true, message: 'Appointment marked as completed', data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAvailableSlots,
  bookAppointment,
  getDoctorAppointments,
  getPatientAppointments,
  cancelAppointment,
  completeAppointment,
};