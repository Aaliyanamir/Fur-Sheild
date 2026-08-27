const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['APPOINTMENT', 'VACCINE', 'ORDER', 'SYSTEM', 'ADOPTION'],
    default: 'SYSTEM'
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  actionUrl: {
    type: String,
    default: '/'
  }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
