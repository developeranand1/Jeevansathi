const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  plan_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubscriptionPlan',
    required: true,
  },
  payment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment',
    required: true,
    unique: true,
  },
  start_date: {
    type: Date,
    required: true,
  },
  expiry_date: {
    type: Date,
    required: true,
    index: true,
  },
  contacts_remaining: {
    type: Number,
    required: true,
    default: 0,
  },
  interests_remaining: {
    type: Number,
    required: true,
    default: 0,
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'EXPIRED', 'CANCELLED'],
    default: 'ACTIVE',
    index: true,
  },
  auto_renew: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

subscriptionSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.subscription_id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
