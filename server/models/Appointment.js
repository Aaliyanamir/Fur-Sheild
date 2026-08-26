const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  petId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Pet', 
    required: true 
  },
  ownerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  vetId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  status: { 
    type: String, 
    enum: ['WAITING', 'EXAM', 'DISCHARGED', 'CANCELLED'], 
    default: 'WAITING' 
  },
  severity: { 
    type: String, 
    enum: ['ROUTINE', 'URGENT', 'EMERGENCY'],
    required: true
  },
  reason: { type: String, required: true },
  medicalNotes: { type: String },
  vitals: {
    weight: Number,
    temperature: Number,
    heartRate: Number
  },
  scheduledAt: { type: Date, required: true },
  completedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);

