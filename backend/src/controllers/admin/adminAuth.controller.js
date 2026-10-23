const bcrypt = require('bcryptjs');
const Admin = require('../../models/Admin');
const { signAdminToken } = require('../../services/token.service');
const { successResponse, errorResponse } = require('../../utils/response');
const { logAudit } = require('../../middlewares/auditLog');

/**
 * Direct Admin Login (Single Step, 2FA Removed)
 * POST /api/v1/admin/auth/login
 */
const login = async (req, res) => {
  try {
    const { admin_name, password } = req.body;

    if (!admin_name || !password) {
      return errorResponse(res, 'admin_name and password are required', 'AUTH_MISSING_CREDENTIALS', 400);
    }

    const admin = await Admin.findOne({ admin_name: admin_name.toLowerCase().trim() })
      .select('+password_hash');

    if (!admin) {
      return errorResponse(res, 'Invalid credentials', 'AUTH_INVALID_CREDENTIALS', 401);
    }

    if (!admin.is_active) {
      return errorResponse(res, 'Admin account is deactivated', 'AUTH_ACCOUNT_DEACTIVATED', 403);
    }

    if (admin.locked_until && admin.locked_until > new Date()) {
      return errorResponse(res, 'Account locked due to multiple failed attempts. Please try later.', 'AUTH_ACCOUNT_LOCKED', 403);
    }

    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      admin.failed_login_attempts = (admin.failed_login_attempts || 0) + 1;
      if (admin.failed_login_attempts >= 5) {
        admin.locked_until = new Date(Date.now() + 30 * 60 * 1000);
      }
      await admin.save();
      return errorResponse(res, 'Invalid credentials', 'AUTH_INVALID_CREDENTIALS', 401);
    }

    // Reset failed attempts & issue token directly
    admin.failed_login_attempts = 0;
    admin.locked_until = undefined;
    admin.last_login_at = new Date();
    admin.last_login_ip = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
    await admin.save();

    const token = signAdminToken(admin);

    await logAudit({
      adminId: admin._id,
      action: 'ADMIN_LOGIN',
      targetType: 'ADMIN',
      targetId: admin._id,
      ipAddress: admin.last_login_ip,
    });

    return successResponse(res, 'Login successful', {
      access_token: token,
      admin: {
        admin_id: admin._id,
        admin_name: admin.admin_name,
        full_name: admin.full_name,
        email: admin.email,
        admin_role: admin.admin_role,
        permissions: admin.permissions || [],
      },
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return errorResponse(res, error.message, 'SERVER_ERROR', 500);
  }
};

/**
 * Get Current Admin
 */
const getMe = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin_id);
    if (!admin) {
      return errorResponse(res, 'Admin not found', 'ADMIN_NOT_FOUND', 404);
    }
    return successResponse(res, 'Admin profile fetched', admin);
  } catch (error) {
    return errorResponse(res, error.message, 'SERVER_ERROR', 500);
  }
};

/**
 * Admin Logout
 */
const logout = async (req, res) => {
  try {
    return successResponse(res, 'Admin logged out successfully');
  } catch (error) {
    return errorResponse(res, error.message, 'SERVER_ERROR', 500);
  }
};

module.exports = {
  login,
  getMe,
  logout,
};
