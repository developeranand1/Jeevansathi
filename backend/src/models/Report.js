const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reporter_user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reported_user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  reason: {
    type: String,
    enum: ['FAKE_PROFILE', 'ABUSE', 'MONEY_DEMAND', 'MARRIED', 'WRONG_INFO', 'OTHER'],
    required: true,
  },
  description: String,
  evidence_urls: [{ type: String }],
  status: {
    type: String,
    enum: ['OPEN', 'IN_REVIEW', 'ACTION_TAKEN', 'DISMISSED'],
    default: 'OPEN',
    index: true,
  },
  action_taken: {
    type: String,
    enum: ['WARNING', 'SUSPEND', 'BAN', 'NONE'],
  },
  handled_by_admin_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
  },
  resolved_at: Date,
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

reportSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.report_id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Report', reportSchema);
