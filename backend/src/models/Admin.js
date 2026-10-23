const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  admin_name: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
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
  mobile: {
    type: String,
    unique: true,
    required: true,
  },
  password_hash: {
    type: String,
    required: true,
    select: false,
  },
  admin_role: {
    type: String,
    required: true,
    enum: [
      'SUPER_ADMIN',
      'ADMIN',
      'KYC_MODERATOR',
      'FINANCE_MANAGER',
      'RELATIONSHIP_MANAGER',
      'SUPPORT_AGENT',
      'CONTENT_EDITOR',
    ],
  },
  permissions: [{ type: String }],
  is_active: {
    type: Boolean,
    default: true,
  },
  two_factor_enabled: {
    type: Boolean,
    default: true,
  },
  two_factor_secret: {
    type: String,
    select: false,
  },
  profile_photo_url: String,
  assigned_users_count: {
    type: Number,
    default: 0,
  },
  created_by_admin_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
  },
  last_login_at: Date,
  last_login_ip: String,
  failed_login_attempts: {
    type: Number,
    default: 0,
  },
  locked_until: Date,
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

adminSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.admin_id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.password_hash;
    delete ret.two_factor_secret;
    return ret;
  },
});

module.exports = mongoose.model('Admin', adminSchema);
