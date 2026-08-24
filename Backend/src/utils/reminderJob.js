const Appointment = require('../models/Appointment');
const { sendEmail } = require('./notificationService');

const startReminderJob = () => {
  setInterval(async () => {
    try {
      const appointments = await Appointment.find({ status: 'COMPLETED' }).populate('patient').populate('doctor');
      for (const apt of appointments) {
        if (apt.prescription && apt.patient && apt.patient.email) {
          await sendEmail(
            apt.patient.email,
            'Medication Reminder',
            `<h1>Medication Reminder</h1><p>Dear ${apt.patient.name}, this is a reminder to take your prescribed medication as instructed by Dr. ${apt.doctor.name}:</p><p><strong>Prescription:</strong> ${apt.prescription}</p>`
          );
        }
      }
    } catch (error) {
      console.error(error.message);
    }
  }, 3600 * 1000);
};

module.exports = { startReminderJob };
