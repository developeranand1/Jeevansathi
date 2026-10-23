const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  owner_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true,
  },
  owner_type: {
    type: String,
    enum: ['USER', 'ADMIN'],
    required: true,
  },
  refresh_token_hash: {
    type: String,
    required: true,
  },
  device_info: String,
  ip_address: String,
  is_revoked: {
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

sessionSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.session_id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.refresh_token_hash;
    return ret;
  },
});

module.exports = mongoose.model('Session', sessionSchema);
