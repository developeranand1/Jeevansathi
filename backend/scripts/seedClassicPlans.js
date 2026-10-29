const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Plan = require('../src/models/Plan');

const classicPlans = [
  {
    plan_code: 'CLASSIC',
    plan_name: 'Classic Plan',
    subtitle: '50 Contact Tokens / 3 Months',
    badge: 'Starter Match',
    is_popular: false,
    price_inr: 3500,
    gst_percent: 18,
    duration_days: 90,
    contact_views_limit: 50,
    interests_limit: 9999,
    has_relationship_manager: false,
    is_active: true,
    features: [
      'Valid for 3 Months',
      'View 50 contact numbers',
      'Express interest to unlimited profiles',
      'Send messages to members',
      'Advanced search & Profile ID search'
    ]
  },
  {
    plan_code: 'CLASSIC_PLUS',
    plan_name: 'Classic Plus Plan',
    subtitle: '100 Contact Tokens / 8 Months',
    badge: 'Extended Value',
    is_popular: false,
    price_inr: 5500,
    gst_percent: 18,
    duration_days: 240,
    contact_views_limit: 100,
    interests_limit: 9999,
    has_relationship_manager: false,
    is_active: true,
    features: [
      'Valid for 8 Months',
      'View 100 contact numbers',
      'Express interest to unlimited profiles',
      'Send messages to members',
      'Advanced search & Profile ID search'
    ]
  },
  {
    plan_code: 'CLASSIC_GOLD',
    plan_name: 'Classic Gold Plan',
    subtitle: '170 Contact Tokens / 1 Year',
    badge: 'Most Popular',
    is_popular: true,
    price_inr: 8500,
    gst_percent: 18,
    duration_days: 365,
    contact_views_limit: 170,
    interests_limit: 9999,
    has_relationship_manager: false,
    is_active: true,
    features: [
      'Valid for 1 year',
      'View 170 contact numbers',
      'Express interest to unlimited profiles',
      'Send messages to members',
      'Advanced search & Profile ID search'
    ]
  },
  {
    plan_code: 'CLASSIC_DIAMOND',
    plan_name: 'Classic Diamond Plan',
    subtitle: '225 Contact Tokens / 18 Months',
    badge: 'Best Family Pick',
    is_popular: false,
    price_inr: 11000,
    gst_percent: 18,
    duration_days: 540,
    contact_views_limit: 225,
    interests_limit: 9999,
    has_relationship_manager: true,
    is_active: true,
    features: [
      'Valid for 18 Months',
      'View 225 contact numbers',
      'Express interest to unlimited profiles',
      'Send messages to members',
      'Advanced search & Profile ID search'
    ]
  },
  {
    plan_code: 'CLASSIC_PLATINUM',
    plan_name: 'Classic Platinum Plan',
    subtitle: '350 Contact Tokens / 2 Years',
    badge: 'VIP Elite Plan',
    is_popular: false,
    price_inr: 21000,
    gst_percent: 18,
    duration_days: 730,
    contact_views_limit: 350,
    interests_limit: 9999,
    has_relationship_manager: true,
    is_active: true,
    features: [
      'Valid for 2 years',
      'View 350 contact numbers',
      'Express interest to unlimited profiles',
      'Send messages to members',
      'Advanced search & Profile ID search'
    ]
  }
];

async function seedPlans() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding plans...');

    // Deactivate old legacy test plans so only the 5 Classic plans are active
    await Plan.updateMany(
      { plan_code: { $in: ['FREE', 'SILVER', 'GOLD', 'ROYAL_VIP'] } },
      { $set: { is_active: false } }
    );

    for (const planData of classicPlans) {
      await Plan.findOneAndUpdate(
        { plan_code: planData.plan_code },
        { $set: planData },
        { upsert: true, new: true }
      );
      console.log(`✓ Seeded/Updated plan: ${planData.plan_name} (₹${planData.price_inr})`);
    }

    console.log('✨ All 5 Classic Membership plans successfully seeded into MongoDB!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding plans:', error);
    process.exit(1);
  }
}

seedPlans();

