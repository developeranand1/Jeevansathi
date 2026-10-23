const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  matrimony_id: {
    type: String,
    required: true,
    index: true,
  },
  profile_for: {
    type: String,
    enum: ['SELF', 'SON', 'DAUGHTER', 'BROTHER', 'SISTER', 'RELATIVE', 'FRIEND'],
    required: true,
  },
  personal: {
    full_name: { type: String, required: true },
    gender: { type: String, enum: ['BRIDE', 'GROOM'], required: true },
    date_of_birth: { type: Date, required: true },
    height_cm: { type: Number, required: true },
    weight_kg: Number,
    marital_status: {
      type: String,
      enum: ['NEVER_MARRIED', 'DIVORCED', 'WIDOWED', 'AWAITING_DIVORCE'],
      required: true,
    },
    body_type: { type: String, enum: ['SLIM', 'AVERAGE', 'ATHLETIC', 'HEAVY'] },
    complexion: { type: String, enum: ['VERY_FAIR', 'FAIR', 'WHEATISH', 'DARK'] },
    diet: { type: String, enum: ['VEG', 'NON_VEG', 'EGGETARIAN', 'JAIN', 'VEGAN'] },
    smoking: { type: String, enum: ['NO', 'OCCASIONALLY', 'YES'] },
    drinking: { type: String, enum: ['NO', 'OCCASIONALLY', 'YES'] },
    has_disability: { type: Boolean, default: false },
    about_me: { type: String, maxlength: 1000 },
  },
  contact: {
    alternate_mobile: String,
    whatsapp_number: String,
  },
  location: {
    country: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    pincode: String,
  },
  religion_caste: {
    religion: { type: String, required: true },
    caste: String,
    sub_caste: String,
    gotra: String,
    mother_tongue: { type: String, required: true },
    manglik: { type: String, enum: ['MANGLIK', 'NON_MANGLIK', 'ANSHIK', 'DONT_KNOW'] },
  },
  astrology: {
    rashi: String,
    nakshatra: String,
    birth_time: String,
    birth_place: String,
    kundli_url: String,
  },
  education_career: {
    highest_education: { type: String, required: true },
    college: String,
    employed_in: {
      type: String,
      enum: ['GOVT', 'PRIVATE', 'BUSINESS', 'SELF_EMPLOYED', 'DEFENCE', 'NOT_WORKING'],
      required: true,
    },
    profession: String,
    company: String,
    annual_income_min: Number,
    annual_income_max: Number,
    work_city: String,
    work_state: String,
  },
  family: {
    father_occupation: String,
    mother_occupation: String,
    brothers_count: { type: Number, default: 0 },
    sisters_count: { type: Number, default: 0 },
    family_type: { type: String, enum: ['NUCLEAR', 'JOINT'] },
    family_values: { type: String, enum: ['TRADITIONAL', 'MODERATE', 'LIBERAL'] },
    family_status: { type: String, enum: ['MIDDLE_CLASS', 'UPPER_MIDDLE', 'RICH'] },
    family_origin: String,
  },
  partner_preferences: {
    age_min: Number,
    age_max: Number,
    height_min_cm: Number,
    height_max_cm: Number,
    religions: [String],
    castes: [String],
    cities: [String],
    states: [String],
    education: [String],
    marital_status: [String],
    manglik_ok: Boolean,
  },
  privacy: {
    photo_visibility: {
      type: String,
      enum: ['PUBLIC', 'ON_REQUEST', 'MEMBERS_ONLY', 'PREMIUM_ONLY'],
      default: 'PUBLIC',
    },
    phone_visibility: {
      type: String,
      enum: ['ON_ACCEPTANCE', 'PREMIUM_ONLY', 'HIDDEN'],
      default: 'ON_ACCEPTANCE',
    },
    hide_profile: { type: Boolean, default: false },
  },
  photos: [{
    photo_id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    public_id: String,
    url: String,
    thumb_url: String,
    is_main: { type: Boolean, default: false },
    approval_status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING',
    },
    reject_reason: String,
    uploaded_at: { type: Date, default: Date.now },
  }],
  verification: {
    is_id_verified: { type: Boolean, default: false },
    verified_by_admin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    verified_at: Date,
  },
  profile_status: {
    type: String,
    enum: ['DRAFT', 'PENDING_REVIEW', 'LIVE', 'HIDDEN', 'REJECTED'],
    default: 'PENDING_REVIEW',
  },
  is_featured: { type: Boolean, default: false },
  view_count: { type: Number, default: 0 },
  last_active_at: Date,
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

profileSchema.index({
  'personal.gender': 1,
  'religion_caste.caste': 1,
  'location.city': 1,
  'personal.date_of_birth': 1,
});

profileSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.profile_id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Profile', profileSchema);
