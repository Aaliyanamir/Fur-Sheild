const mongoose = require('mongoose');

const shelterAnimalSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Animal name is required'] },
  species: { type: String },
  breed: { type: String },
  avatarUrl: { type: String },
  intakeDate: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ['INTAKE', 'VET_HOLD', 'FOSTER', 'ADOPTABLE', 'ADOPTED'],
    default: 'INTAKE' 
  },
  medicalHolds: [{ type: String }],
  behaviorNotes: { type: String },
  aiTriageLog: [{
    log: { type: String },
    severity: { type: String },
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('ShelterAnimal', shelterAnimalSchema);
