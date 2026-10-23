const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  matrimony_id: {
    type: String,
    unique: true,
    required: true,
  },
  user_name: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
    match: /^[a-z0-9_]{4,20}$/,
  },
  full_name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
  },
  is_email_verified: {
    type: Boolean,
    default: false,
  },
  country_code: {
    type: String,
    default: '+91',
  },
  mobile: {
    type: String,
    unique: true,
    required: true,
    match: /^[6-9]\d{9}$/,
  },
  password_hash: {
    type: String,
    select: false,
  },
  role: {
    type: String,
    enum: ['USER'],
    default: 'USER',
  },
  account_status: {
    type: String,
    enum: ['PENDING_VERIFICATION', 'ACTIVE', 'SUSPENDED', 'BANNED', 'DELETED'],
    default: 'PENDING_VERIFICATION',
  },
  suspend_reason: String,
  is_premium: {
    type: Boolean,
    default: false,
  },
  current_subscription_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription',
  },
  assigned_rm_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
  },
  profile_completion_percent: {
    type: Number,
    default: 0,
  },
  preferred_language: {
    type: String,
    default: 'hi',
  },
  last_login_at: Date,
  last_login_ip: String,
  failed_login_attempts: {
    type: Number,
    default: 0,
  },
  locked_until: Date,
  deleted_at: Date,
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

userSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.user_id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.password_hash;
    return ret;
  },
});

module.exports = mongoose.model('User', userSchema);
