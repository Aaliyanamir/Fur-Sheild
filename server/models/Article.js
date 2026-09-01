const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Title is required'] },
  excerpt: { type: String, required: [true, 'Excerpt is required'] },
  content: { type: String, required: [true, 'Content is required'] },
  category: { type: String, default: 'General' },
  author: { type: String, required: [true, 'Author name is required'] },
  authorRole: { type: String, default: 'User' },
  authorUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  image: { type: String },
  readTime: { type: String, default: '5 min read' },
  status: { 
    type: String, 
    enum: ['PENDING', 'APPROVED', 'REJECTED'],
    default: 'PENDING'
  }
}, { timestamps: true });

module.exports = mongoose.model('Article', articleSchema);
