const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  medication: { type: String, required: true, trim: true },
  dosage: { type: String, required: true, trim: true },
  instructions: { type: String, trim: true }
}, { _id: false });

const appointmentSchema = new mongoose.Schema({
  pet_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
    required: [true, 'Pet ID reference is required']
  },
  owner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner ID reference is required']
  },
  vet_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Veterinarian ID reference is required']
  },
  visit_date: {
    type: Date,
    required: [true, 'Visit date is required']
  },
  appointment_time: {
    type: String,
    required: [true, 'Appointment time is required'],
    trim: true
  },
  reason: {
    type: String,
    required: [true, 'Reason for appointment is required'],
    trim: true
  },
  diagnosis: {
    type: String,
    default: '',
    trim: true
  },
  treatment: {
    type: String,
    default: '',
    trim: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  prescriptions: [prescriptionSchema],
  notes: {
    type: String,
    default: '',
    trim: true
  }
}, {
  timestamps: true
});

// Indexes for scheduling queries
appointmentSchema.index({ vet_id: 1, visit_date: 1 });
appointmentSchema.index({ owner_id: 1 });
appointmentSchema.index({ pet_id: 1 });

const Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;
