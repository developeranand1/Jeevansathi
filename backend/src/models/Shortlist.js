const mongoose = require('mongoose');

const shortlistSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  bookmarked_user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  notes: String,
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

shortlistSchema.index({ user_id: 1, bookmarked_user_id: 1 }, { unique: true });

shortlistSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.shortlist_id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Shortlist', shortlistSchema);
