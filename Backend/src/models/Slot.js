const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['AVAILABLE', 'LOCKED', 'BOOKED'],
      default: 'AVAILABLE',
      index: true,
    },
    // Used for temporary locking during checkout
    lockedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    lockedUntil: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Compound Index
slotSchema.index({ doctor: 1, startTime: 1, status: 1 });

module.exports = mongoose.model('Slot', slotSchema);