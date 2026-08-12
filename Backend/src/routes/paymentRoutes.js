const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment } = require('../controllers/paymentController');
const { protect, authorize } = require('../middlewares/auth');

router.post('/create-order', protect, authorize('patient'), createOrder);
router.post('/verify', protect, authorize('patient'), verifyPayment);

module.exports = router;