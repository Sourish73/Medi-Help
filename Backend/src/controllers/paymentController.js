const crypto = require('crypto');
const razorpayInstance = require('../config/razorpay');
const Appointment = require('../models/Appointment');
const Slot = require('../models/Slot');

const createOrder = async (req, res) => {
  try {
    const { amount, appointmentId } = req.body;

    const options = {
      amount: Math.round(amount * 100), 
      currency: 'INR',
      receipt: `receipt_${appointmentId}`,
    };

    const order = await razorpayInstance.orders.create(options);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};


const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, appointmentId } = req.body;

    // Generate expected signature using HMAC-SHA256 algorithm
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    // Cryptographic match check
    if (expectedSignature === razorpay_signature) {
     
      const appointment = await Appointment.findByIdAndUpdate(
        appointmentId,
        {
          paymentStatus: 'PAID',
          status: 'CONFIRMED',
          paymentId: razorpay_payment_id,
        },
        { new: true }
      );

      // Update the slot to BOOKED and unset lockedUntil
      await Slot.findByIdAndUpdate(appointment.slot, {
        $set: { status: 'BOOKED' },
        $unset: { lockedUntil: 1 }
      });

      return res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        data: appointment,
      });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid payment signature verification failed' });
    }
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createOrder, verifyPayment };