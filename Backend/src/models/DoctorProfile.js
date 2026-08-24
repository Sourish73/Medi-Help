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
      trim: true,
    },
    fees: {
      type: Number,
      required: [true, 'Consultation fee is required'],
      min: [0, 'Consultation fee cannot be negative'],
    },
    experienceYears: {
      type: Number,
      default: 0,
      min: [0, 'Experience years cannot be negative'],
    },
    bio: {
      type: String,
      default: '',
      trim: true,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
    },
    slotDurationMinutes: {
      type: Number,
      default: 30,
      min: [10, 'Slot duration must be at least 10 minutes'],
      max: [120, 'Slot duration cannot exceed 120 minutes'],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    workingHours: {
      start: {
        type: String,
        default: '09:00',
        match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Please fill a valid start hour in HH:MM format'],
      },
      end: {
        type: String,
        default: '17:00',
        match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Please fill a valid end hour in HH:MM format'],
      },
    },
    leaveDays: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

doctorProfileSchema.index({ specialization: 1 });
doctorProfileSchema.index({ isAvailable: 1 });

module.exports = mongoose.model('DoctorProfile', doctorProfileSchema);