const Appointment = require('../models/Appointment');
const Slot = require('../models/Slot');
const DoctorProfile = require('../models/DoctorProfile');
const User = require('../models/User');
const { generateAvailableSlots } = require('../utils/slotCalculator');
const { generatePreVisitSummary, generatePostVisitSummary } = require('./aiController');
const { sendEmail, handleCalendarEvent } = require('../utils/notificationService');

const getAvailableSlots = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ success: false, message: 'Date parameter is required' });
    }

    const doctorProfile = await DoctorProfile.findOne({ user: doctorId });
    if (!doctorProfile) {
      return res.status(404).json({ success: false, message: 'Doctor profile not found' });
    }

    if (doctorProfile.leaveDays && doctorProfile.leaveDays.includes(date)) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: [],
      });
    }

    const startHour = (doctorProfile.workingHours && doctorProfile.workingHours.start) || '09:00';
    const endHour = (doctorProfile.workingHours && doctorProfile.workingHours.end) || '17:00';

    const shiftStart = new Date(`${date}T${startHour}:00.000Z`);
    const shiftEnd = new Date(`${date}T${endHour}:00.000Z`);

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
    const { doctorId, startTime, endTime, symptoms } = req.body;

    const doctorProfile = await DoctorProfile.findOne({
      $or: [{ _id: doctorId }, { user: doctorId }]
    });
    
    if (!doctorProfile) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ success: false, message: 'Invalid startTime or endTime format' });
    }

    const leaveDateStr = start.toISOString().split('T')[0];
    if (doctorProfile.leaveDays && doctorProfile.leaveDays.includes(leaveDateStr)) {
      return res.status(400).json({ success: false, message: 'Doctor is on leave on this date' });
    }

    let slot = await Slot.findOneAndUpdate(
      {
        doctor: doctorProfile.user, 
        startTime: start,
        endTime: end,
        status: { $ne: 'BOOKED' },
      },
      {
        $set: {
          status: 'LOCKED',
          lockedBy: req.user._id,
          lockedUntil: new Date(Date.now() + 15 * 60 * 1000)
        },
      },
      { returnDocument: 'after', upsert: true }
    );

    const preVisitSum = await generatePreVisitSummary(symptoms || 'Routine checkup');

    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor: doctorProfile.user,
      slot: slot._id,
      amount: doctorProfile.fees,
      status: 'PENDING',
      paymentStatus: 'UNPAID',
      symptoms: symptoms || '',
      preVisitSummary: preVisitSum,
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
    const appointment = await Appointment.findById(req.params.id).populate('doctor').populate('patient').populate('slot');

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    if (
      appointment.patient._id.toString() !== req.user._id.toString() &&
      appointment.doctor._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this appointment' });
    }

    appointment.status = 'CANCELLED';
    await appointment.save();

    await Slot.findByIdAndUpdate(appointment.slot._id, {
      status: 'AVAILABLE',
      lockedBy: null,
    });

    if (appointment.calendarEventId) {
      await handleCalendarEvent('DELETE', appointment, appointment.doctor, appointment.patient);
    }

    await sendEmail(
      appointment.patient.email,
      'Appointment Cancelled',
      `<h1>Appointment Cancelled</h1><p>Your appointment with Dr. ${appointment.doctor.name} on ${appointment.slot.startTime} has been cancelled.</p>`
    );
    await sendEmail(
      appointment.doctor.email,
      'Appointment Cancelled By Patient',
      `<h1>Appointment Cancelled</h1><p>The appointment with patient ${appointment.patient.name} on ${appointment.slot.startTime} has been cancelled.</p>`
    );

    res.status(200).json({ success: true, message: 'Appointment cancelled and slot released', data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const completeAppointment = async (req, res) => {
  try {
    const { clinicalNotes, prescription } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    if (appointment.doctor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to perform this action' });
    }

    const postVisitSum = await generatePostVisitSummary(clinicalNotes || '');

    appointment.status = 'COMPLETED';
    appointment.clinicalNotes = clinicalNotes || '';
    appointment.prescription = prescription || '';
    appointment.postVisitSummary = postVisitSum;
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