const jwt = require('jsonwebtoken');

const getAdminJwtSecret = () => process.env.ADMIN_JWT_SECRET || 'fallback_admin_secret_key_8849';
const getUserAccessSecret = () => process.env.JWT_ACCESS_SECRET || 'fallback_user_access_secret_8849';
const getUserRefreshSecret = () => process.env.JWT_REFRESH_SECRET || 'fallback_user_refresh_secret_8849';

const signAdminToken = (admin) => {
  const payload = {
    sub: admin._id ? admin._id.toString() : admin.admin_id.toString(),
    type: 'ADMIN',
    role: admin.admin_role,
    admin_name: admin.admin_name,
    permissions: admin.permissions || [],
  };
  return jwt.sign(payload, getAdminJwtSecret(), { expiresIn: '1h' });
};

const verifyAdminToken = (token) => {
  return jwt.verify(token, getAdminJwtSecret());
};

const signUserAccessToken = (user) => {
  const payload = {
    sub: user._id ? user._id.toString() : user.user_id.toString(),
    type: 'USER',
    role: 'USER',
    is_premium: !!user.is_premium,
  };
  return jwt.sign(payload, getUserAccessSecret(), { expiresIn: '15m' });
};

const signUserRefreshToken = (user) => {
  const payload = {
    sub: user._id ? user._id.toString() : user.user_id.toString(),
    type: 'USER',
  };
  return jwt.sign(payload, getUserRefreshSecret(), { expiresIn: '30d' });
};

module.exports = {
  signAdminToken,
  verifyAdminToken,
  signUserAccessToken,
  signUserRefreshToken,
};
