const mongoose = require('mongoose');

const adoptionRequestSchema = new mongoose.Schema({
  animalId: { type: mongoose.Schema.Types.ObjectId, ref: 'ShelterAnimal', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  shelterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  applicantName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  livingSituation: { type: String },
  experience: { type: String },
  message: { type: String },
  paymentMethod: { type: String, default: 'Cash on Pickup' },
  paymentAmount: { type: Number, default: 0 },
  paymentStatus: { type: String, default: 'Paid' },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  petSnapshot: {
    name: { type: String },
    species: { type: String },
    breed: { type: String },
    age: { type: String },
    adoptionFee: { type: Number, default: 0 },
    pickupAddress: { type: String }
  }
}, { timestamps: true });

module.exports = mongoose.model('AdoptionRequest', adoptionRequestSchema);
