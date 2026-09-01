const mongoose = require('mongoose');

const shelterAnimalSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Animal name is required'] },
  species: { type: String },
  breed: { type: String },

  age: { type: String },
  dailyLogs: [{
    date: { type: Date, default: Date.now },
    activityType: { type: String, enum: ['Feeding', 'Grooming', 'Medication', 'Walk/Exercise', 'Other'] },
    notes: { type: String },
    loggedBy: { type: String }
  }],

  avatarUrl: { type: String },
  gender: { type: String, default: 'Male' },
  intakeDate: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ['INTAKE', 'VET_HOLD', 'FOSTER', 'ADOPTABLE', 'ADOPTED'],
    default: 'ADOPTABLE' 
  },
  medicalHolds: [{ type: String }],
  behaviorNotes: { type: String },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  pickupAddress: { type: String },
  ownerContact: {
    name: { type: String },
    email: { type: String },
    phone: { type: String }
  },
  adoptionFee: { type: Number, default: 0 },
  adoptedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  adoptedAt: { type: Date },
  adopterInfo: {
    applicantName: { type: String },
    email: { type: String },
    phone: { type: String },
    livingSituation: { type: String },
    experience: { type: String },
    paymentMethod: { type: String, default: 'Cash on Pickup' },
    paymentStatus: { type: String, default: 'Paid' },
    paymentAmount: { type: Number, default: 0 },
    message: { type: String }
  },
  aiTriageLog: [{
    log: { type: String },
    severity: { type: String },
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('ShelterAnimal', shelterAnimalSchema);
