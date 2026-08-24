const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Pet name is required'],
    trim: true
  },
  species: {
    type: String,
    enum: ['Dog', 'Cat', 'Bird', 'Reptile', 'Rabbit', 'Other'],
    required: [true, 'Species is required']
  },
  breed: {
    type: String,
    trim: true,
    default: 'Mixed Breed'
  },
  age: {
    type: Number,
    required: [true, 'Pet age is required'],
    min: [0, 'Age cannot be negative']
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Unknown'],
    required: [true, 'Gender is required']
  },
  images: [{
    type: String,
    trim: true
  }],
  owner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  shelter_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  is_adoptable: {
    type: Boolean,
    default: false
  },
  adoption_status: {
    type: String,
    enum: ['Not Available', 'Available', 'Pending', 'Adopted'],
    default: 'Not Available'
  },
  weight: {
    type: Number,
    min: 0
  },
  medical_notes: {
    type: String,
    trim: true,
    default: ''
  },
  vaccinated: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexing for faster search & filter operations
petSchema.index({ name: 'text', species: 'text', breed: 'text' });
petSchema.index({ owner_id: 1 });
petSchema.index({ shelter_id: 1 });
petSchema.index({ is_adoptable: 1, adoption_status: 1 });

const Pet = mongoose.model('Pet', petSchema);
module.exports = Pet;
