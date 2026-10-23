require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../src/models/Admin');

const resetAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const salt = await bcrypt.genSalt(12);
  const password_hash = await bcrypt.hash('SuperPassword@123', salt);

  await Admin.findOneAndUpdate(
    { admin_name: 'superadmin' },
    {
      password_hash,
      failed_login_attempts: 0,
      locked_until: null,
      is_active: true,
      admin_role: 'SUPER_ADMIN',
    },
    { upsert: true }
  );

  console.log('Superadmin successfully reset and unlocked with password: SuperPassword@123');
  process.exit(0);
};

resetAdmin();
