const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const vetProfileSchema = new mongoose.Schema({
  license_number: { type: String, trim: true },
  clinic_name: { type: String, trim: true },
  clinic_address: { type: String, trim: true },
  specialization: { type: String, trim: true },
  years_of_experience: { type: Number, default: 0 },
  bio: { type: String, trim: true },
  available_slots: [{
    day_of_week: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
    start_time: { type: String },
    end_time: { type: String }
  }]
}, { _id: false });

const shelterProfileSchema = new mongoose.Schema({
  shelter_name: { type: String, trim: true },
  registration_number: { type: String, trim: true },
  capacity: { type: Number, default: 0 },
  description: { type: String, trim: true },
  website: { type: String, trim: true }
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false
  },
  contact_number: {
    type: String,
    required: [true, 'Contact number is required'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  role: {
    type: String,
    enum: ['owner', 'vet', 'shelter'],
    required: [true, 'User role is required']
  },
  avatar: {
    type: String,
    default: ''
  },
  vet_profile: vetProfileSchema,
  shelter_profile: shelterProfileSchema
}, {
  timestamps: true
});

// Pre-save hook to hash password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
