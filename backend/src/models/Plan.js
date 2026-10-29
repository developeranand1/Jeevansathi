const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  plan_code: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    uppercase: true,
  },
  plan_name: {
    type: String,
    required: true,
    trim: true,
  },
  subtitle: {
    type: String,
    default: '',
  },
  badge: {
    type: String,
    default: '',
  },
  is_popular: {
    type: Boolean,
    default: false,
  },
  price_inr: {
    type: Number,
    required: true,
  },
  gst_percent: {
    type: Number,
    default: 18,
  },
  duration_days: {
    type: Number,
    required: true,
  },
  contact_views_limit: {
    type: Number,
    required: true,
  },
  interests_limit: {
    type: Number,
    required: true,
  },
  features: [{ type: String }],
  has_relationship_manager: {
    type: Boolean,
    default: false,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  created_by_admin_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
  },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

planSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.plan_id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('SubscriptionPlan', planSchema);
