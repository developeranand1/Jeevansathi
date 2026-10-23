const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  discount_type: {
    type: String,
    enum: ['PERCENT', 'FLAT'],
    required: true,
  },
  discount_value: {
    type: Number,
    required: true,
  },
  max_discount_inr: Number,
  valid_from: {
    type: Date,
    required: true,
  },
  valid_to: {
    type: Date,
    required: true,
  },
  usage_limit: {
    type: Number,
    required: true,
  },
  used_count: {
    type: Number,
    default: 0,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  created_by_admin_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true,
  },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

couponSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.coupon_id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Coupon', couponSchema);
