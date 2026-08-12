const express = require('express');
const router = express.Router();
const {
  getAvailableSlots, bookAppointment, getDoctorAppointments, getPatientAppointments,cancelAppointment,completeAppointment,
} = require('../controllers/appointmentController');
const { protect, authorize } = require('../middlewares/auth');

router.get('/available-slots/:doctorId', getAvailableSlots);


router.post('/book', protect, authorize('patient'), bookAppointment);
router.get('/patient', protect, authorize('patient'), getPatientAppointments);


router.get('/doctor', protect, authorize('doctor'), getDoctorAppointments);
router.patch('/:id/complete', protect, authorize('doctor'), completeAppointment);


router.patch('/:id/cancel', protect, cancelAppointment);

module.exports = router;