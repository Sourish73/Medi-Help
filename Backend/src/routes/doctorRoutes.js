const express = require('express');
const router = express.Router();
const {
  updateProfile,
  getAllDoctors,
  getDoctorById,
  changeAvailability,
  doctorDashboard,
  adminCreateDoctor,
  adminUpdateDoctor,
  adminGetDoctors,
  adminDeleteDoctor,
} = require('../controllers/doctorController');
const { protect, authorize } = require('../middlewares/auth');

router.get('/', getAllDoctors);
router.get('/:id', getDoctorById);

router.post('/profile', protect, authorize('doctor'), updateProfile);
router.patch('/change-availability', protect, authorize('doctor'), changeAvailability);
router.get('/dashboard/stats', protect, authorize('doctor'), doctorDashboard);

router.post('/admin', protect, authorize('admin'), adminCreateDoctor);
router.put('/admin/:id', protect, authorize('admin'), adminUpdateDoctor);
router.get('/admin/list', protect, authorize('admin'), adminGetDoctors);
router.delete('/admin/:id', protect, authorize('admin'), adminDeleteDoctor);

module.exports = router;