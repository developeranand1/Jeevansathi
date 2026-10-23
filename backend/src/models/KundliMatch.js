const mongoose = require('mongoose');

const kundliMatchSchema = new mongoose.Schema({
  groom_user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  bride_user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  guna_scores: {
    varna: { type: Number, default: 0 },
    vashya: { type: Number, default: 0 },
    tara: { type: Number, default: 0 },
    yoni: { type: Number, default: 0 },
    graha_maitri: { type: Number, default: 0 },
    gana: { type: Number, default: 0 },
    bhakoot: { type: Number, default: 0 },
    nadi: { type: Number, default: 0 },
  },
  total_score: {
    type: Number,
    required: true,
  },
  manglik_dosha_match: Boolean,
  verdict: {
    type: String,
    enum: ['EXCELLENT', 'GOOD', 'AVERAGE', 'NOT_RECOMMENDED'],
    required: true,
  },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

kundliMatchSchema.index({ groom_user_id: 1, bride_user_id: 1 });

kundliMatchSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.match_id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('KundliMatch', kundliMatchSchema);
