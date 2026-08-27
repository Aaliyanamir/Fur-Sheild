const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vet: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pet: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet' }, // Optional if new pet
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'], default: 'PENDING' },
  type: { type: String, enum: ['IN_PERSON', 'TELEHEALTH'], default: 'IN_PERSON' },
  meetingLink: { type: String }, // For telehealth
  prescription: {
    medication: String,
    dosage: String,
    instructions: String,
    issuedAt: Date
  },
  labResults: {
    testName: String,
    resultSummary: String,
    documentUrl: String,
    date: Date
  },
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
