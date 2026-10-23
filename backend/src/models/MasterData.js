const mongoose = require('mongoose');

const masterDataSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: [
      'RELIGION',
      'CASTE',
      'SUB_CASTE',
      'GOTRA',
      'CITY',
      'STATE',
      'RASHI',
      'NAKSHATRA',
      'EDUCATION',
      'PROFESSION',
      'MOTHER_TONGUE',
    ],
    required: true,
    index: true,
  },
  value: {
    type: String,
    required: true,
    trim: true,
  },
  parent_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MasterData',
  },
  sort_order: {
    type: Number,
    default: 0,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

masterDataSchema.index({ type: 1, value: 1 }, { unique: true });

masterDataSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.master_id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('MasterData', masterDataSchema);
