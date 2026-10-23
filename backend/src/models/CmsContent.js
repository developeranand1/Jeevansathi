const mongoose = require('mongoose');

const cmsContentSchema = new mongoose.Schema({
  content_type: {
    type: String,
    enum: ['SUCCESS_STORY', 'BLOG', 'BANNER', 'FAQ', 'PAGE'],
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  body: String,
  image_urls: [{ type: String }],
  couple_names: String,
  wedding_date: Date,
  status: {
    type: String,
    enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
    default: 'DRAFT',
    index: true,
  },
  published_by_admin_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
  },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

cmsContentSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.content_id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('CmsContent', cmsContentSchema);
