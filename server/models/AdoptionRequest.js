const mongoose = require('mongoose');

const adoptionRequestSchema = new mongoose.Schema({
  animalId: { type: mongoose.Schema.Types.ObjectId, ref: 'ShelterAnimal', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  applicantName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  livingSituation: { type: String },
  experience: { type: String },
  message: { type: String },
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('AdoptionRequest', adoptionRequestSchema);
