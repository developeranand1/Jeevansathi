const mongoose = require('mongoose');

const otpLogSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    index: true,
  },
  otp_hash: {
    type: String,
    required: true,
  },
  purpose: {
    type: String,
    enum: ['LOGIN', 'REGISTER', 'RESET_PASSWORD'],
    required: true,
  },
  attempts: {
    type: Number,
    default: 0,
  },
  is_used: {
    type: Boolean,
    default: false,
  },
  expires_at: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 },
  },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

otpLogSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.otp_id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.otp_hash;
    return ret;
  },
});

module.exports = mongoose.model('OtpLog', otpLogSchema);
