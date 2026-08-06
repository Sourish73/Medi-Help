const express = require('express');
const router = express.Router();
const {updateProfile,getAllDoctors,getDoctorById,changeAvailability,doctorDashboard,} = require('../controllers/doctorController');
const { protect, authorize } = require('../middlewares/auth');

// Public routes
router.get('/', getAllDoctors);
router.get('/:id', getDoctorById);

// Protected Doctor routes
router.post('/profile', protect, authorize('doctor'), updateProfile);
router.patch('/change-availability', protect, authorize('doctor'), changeAvailability);
router.get('/dashboard/stats', protect, authorize('doctor'), doctorDashboard);

module.exports = router;