const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  type: {
    type: String,
    enum: [
      'INTEREST_RECEIVED',
      'INTEREST_ACCEPTED',
      'KYC_APPROVED',
      'PLAN_EXPIRING',
      'NEW_MATCH',
      'SYSTEM',
    ],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  channel: {
    type: String,
    enum: ['EMAIL', 'IN_APP'],
    default: 'IN_APP',
  },
  is_read: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

notificationSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.notification_id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Notification', notificationSchema);
