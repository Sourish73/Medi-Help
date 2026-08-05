const mongoose = require('mongoose');

const doctorProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    specialization: {
      type: String,
      required: [true, 'Specialization is required'],
    },
    fees: {
      type: Number,
      required: [true, 'Consultation fee is required'],
    },
    experienceYears: {
      type: Number,
      default: 0,
    },
    bio: {
      type: String,
      default: '',
    },
    slotDurationMinutes: {
      type: Number,
      default: 30, // Default duration per slot (e.g., 30 mins)
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('DoctorProfile', doctorProfileSchema);