const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  ownerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true 
  },
  name: { type: String, required: [true, 'Pet name is required'] },
  species: { type: String, required: [true, 'Species is required'] },
  breed: { type: String },
  gender: { type: String, enum: ['Male', 'Female'] },
  age: { type: Number },
  microchipId: { type: String },
  dob: { type: Date },
  weightHistory: [{
    weight: { type: Number },
    date: { type: Date, default: Date.now }
  }],
  avatarUrl: { type: String },
  dnaMarkers: [{ type: String }],
  medicalPassport: {
    vaccinations: [{ name: String, dateAdministered: Date, nextDue: Date }],
    allergies: [{ type: String }],
    chronicConditions: [{ type: String }]
  }
}, { timestamps: true });

module.exports = mongoose.model('Pet', petSchema);

