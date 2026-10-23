require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../src/models/Admin');

const seedSuperAdmin = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/jeevansathi';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    const adminName = 'superadmin';
    const email = 'superadmin@vivah.com';
    const password = 'SuperPassword@123';

    let existing = await Admin.findOne({ admin_name: adminName });
    if (existing) {
      console.log('Super admin already exists:', existing.admin_name);
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(12);
    const password_hash = await bcrypt.hash(password, salt);

    const superAdmin = await Admin.create({
      admin_name: adminName,
      full_name: 'System Super Admin',
      email,
      mobile: '9999999999',
      password_hash,
      admin_role: 'SUPER_ADMIN',
      permissions: ['*'],
      is_active: true,
      two_factor_enabled: true,
    });

    console.log('Super Admin created successfully:');
    console.log({
      admin_id: superAdmin._id,
      admin_name: superAdmin.admin_name,
      email: superAdmin.email,
      temporary_password: password,
    });

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedSuperAdmin();
