const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    slot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Slot',
      required: true,
      unique: true, 
    },
    status: {
      type: String,
      enum: {
        values: ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'],
        message: '{VALUE} is not a valid appointment status',
      },
      default: 'PENDING',
    },
    paymentStatus: {
      type: String,
      enum: {
        values: ['UNPAID', 'PAID', 'REFUNDED'],
        message: '{VALUE} is not a valid payment status',
      },
      default: 'UNPAID',
    },
    paymentId: {
      type: String,
      default: '',
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, 'Consultation amount is required'],
      min: [0, 'Consultation amount cannot be negative'],
    },
    symptoms: {
      type: String,
      default: '',
      trim: true,
      maxlength: [1000, 'Symptoms details cannot exceed 1000 characters'],
    },
    preVisitSummary: {
      urgency: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Low',
      },
      chiefComplaint: {
        type: String,
        default: '',
        trim: true,
      },
      suggestedQuestions: {
        type: [String],
        default: [],
      },
    },
    clinicalNotes: {
      type: String,
      default: '',
      trim: true,
    },
    prescription: {
      type: String,
      default: '',
      trim: true,
    },
    postVisitSummary: {
      type: String,
      default: '',
      trim: true,
    },
    calendarEventId: {
      type: String,
      default: '',
      trim: true,
    },
  },
  { timestamps: true }
);

appointmentSchema.index({ status: 1 });
appointmentSchema.index({ paymentStatus: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);