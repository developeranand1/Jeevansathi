const mongoose = require('mongoose');

const rmAssignmentSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  rm_admin_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true,
    index: true,
  },
  assigned_by_admin_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true,
  },
  suggested_profile_ids: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
  }],
  call_notes: [{
    note: { type: String, required: true },
    called_at: { type: Date, default: Date.now },
  }],
  status: {
    type: String,
    enum: ['ACTIVE', 'COMPLETED', 'REASSIGNED'],
    default: 'ACTIVE',
  },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

rmAssignmentSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.assignment_id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('RmAssignment', rmAssignmentSchema);
