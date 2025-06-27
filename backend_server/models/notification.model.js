const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const notificationSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Title is required']
  },
  message: {
    type: String,
    required: [true, 'Message content is required'],
    trim: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  imageUrl: {
    type: String,
    trim: true
  }
});

const Notification = model('Notification', notificationSchema);
module.exports = Notification;
