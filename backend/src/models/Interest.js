const mongoose = require('mongoose');

const interestSchema = new mongoose.Schema({
  sender_user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  receiver_user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  status: {
    type: String,
    enum: ['PENDING', 'ACCEPTED', 'DECLINED', 'CANCELLED', 'EXPIRED'],
    default: 'PENDING',
    index: true,
  },
  message: {
    type: String,
    maxlength: 300,
  },
  responded_at: Date,
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

interestSchema.index({ sender_user_id: 1, receiver_user_id: 1 }, { unique: true });

interestSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.interest_id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Interest', interestSchema);
