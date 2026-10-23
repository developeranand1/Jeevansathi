const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
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
  invoice_number: {
    type: String,
    unique: true,
  },
  gateway: {
    type: String,
    enum: ['RAZORPAY', 'CASHFREE', 'STRIPE'],
    default: 'RAZORPAY',
  },
  gateway_order_id: {
    type: String,
    required: true,
    unique: true,
  },
  gateway_payment_id: {
    type: String,
    unique: true,
    sparse: true,
  },
  gateway_signature: String,
  amount_inr: {
    type: Number,
    required: true,
  },
  gst_amount_inr: {
    type: Number,
    required: true,
  },
  discount_inr: {
    type: Number,
    default: 0,
  },
  total_paid_inr: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'INR',
  },
  coupon_code: String,
  payment_method: String,
  status: {
    type: String,
    enum: ['CREATED', 'PAID', 'FAILED', 'REFUND_PENDING', 'REFUNDED'],
    default: 'CREATED',
    index: true,
  },
  failure_reason: String,
  is_webhook_verified: {
    type: Boolean,
    default: false,
  },
  refund_id: String,
  refund_amount_inr: Number,
  refunded_by_admin_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
  },
  paid_at: Date,
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

paymentSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.payment_id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Payment', paymentSchema);
