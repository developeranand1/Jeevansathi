const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  admin_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true,
    index: true,
  },
  action: {
    type: String,
    required: true,
  },
  target_type: {
    type: String,
    required: true,
  },
  target_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  before: mongoose.Schema.Types.Mixed,
  after: mongoose.Schema.Types.Mixed,
  ip_address: {
    type: String,
    required: true,
  },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: false },
});

auditLogSchema.index({ admin_id: 1, created_at: -1 });

auditLogSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.log_id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
