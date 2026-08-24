const mongoose = require('mongoose');

const vaccinationSchema = new mongoose.Schema({
  vaccine_name: { type: String, required: true, trim: true },
  administered_date: { type: Date, required: true },
  due_date: { type: Date },
  administrator: { type: String, trim: true }
}, { _id: true });

const illnessSchema = new mongoose.Schema({
  illness_name: { type: String, required: true, trim: true },
  diagnosed_date: { type: Date, required: true },
  status: { type: String, enum: ['Active', 'Recovered', 'Chronic', 'Under Treatment'], default: 'Active' },
  severity: { type: String, enum: ['Mild', 'Moderate', 'Severe'], default: 'Mild' },
  notes: { type: String, trim: true }
}, { _id: true });

const milestoneSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  date: { type: Date, required: true, default: Date.now },
  description: { type: String, trim: true },
  category: {
    type: String,
    enum: ['Vaccination', 'Checkup', 'Surgery', 'Grooming', 'Milestone', 'Treatment', 'Certificate', 'Other'],
    default: 'Milestone'
  },
  image_url: { type: String, trim: true }
}, { _id: true });

const healthRecordSchema = new mongoose.Schema({
  pet_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
    required: [true, 'Pet ID reference is required']
  },
  vet_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Creator User ID is required']
  },
  vaccination_dates: [vaccinationSchema],
  illnesses: [illnessSchema],
  milestones: [milestoneSchema],
  certificate_url: {
    type: String,
    default: '',
    trim: true
  },
  attachments: [{
    type: String,
    trim: true
  }],
  general_notes: {
    type: String,
    default: '',
    trim: true
  }
}, {
  timestamps: true
});

// Indexes for pet timeline queries
healthRecordSchema.index({ pet_id: 1 });
healthRecordSchema.index({ vet_id: 1 });
healthRecordSchema.index({ created_by: 1 });

const HealthRecord = mongoose.model('HealthRecord', healthRecordSchema);
module.exports = HealthRecord;
