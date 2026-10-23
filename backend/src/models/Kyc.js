const mongoose = require('mongoose');

const kycSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  id_proof_type: {
    type: String,
    enum: ['AADHAAR', 'PASSPORT', 'PAN', 'VOTER_ID', 'DRIVING_LICENSE'],
    required: true,
  },
  id_number_masked: {
    type: String,
    required: true,
  },
  document_front_url: {
    type: String,
    required: true,
  },
  document_back_url: String,
  selfie_url: String,
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED', 'RESUBMIT_REQUIRED'],
    default: 'PENDING',
    index: true,
  },
  reject_reason: String,
  reviewed_by_admin_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
  },
  reviewed_at: Date,
  submitted_at: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

kycSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.kyc_id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('KycDocument', kycSchema);
