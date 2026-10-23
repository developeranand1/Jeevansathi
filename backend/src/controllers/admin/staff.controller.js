const bcrypt = require('bcryptjs');
const Admin = require('../../models/Admin');
const { successResponse, errorResponse } = require('../../utils/response');
const { logAudit } = require('../../middlewares/auditLog');
const { ADMIN_ROLES } = require('../../utils/constants');

/**
 * Super Admin: Create a new admin / staff account
 * POST /api/v1/admin/admins
 */
const createAdmin = async (req, res) => {
  try {
    const {
      admin_name,
      full_name,
      email,
      mobile,
      password,
      admin_role,
      permissions = [],
    } = req.body;

    if (!admin_name || !full_name || !email || !mobile || !password || !admin_role) {
      return errorResponse(res, 'All required fields must be provided', 'VALIDATION_ERROR', 400);
    }

    if (!ADMIN_ROLES.includes(admin_role)) {
      return errorResponse(res, `Invalid admin_role. Allowed: ${ADMIN_ROLES.join(', ')}`, 'INVALID_ROLE', 400);
    }

    // Check duplicate username or email
    const existing = await Admin.findOne({
      $or: [
        { admin_name: admin_name.toLowerCase().trim() },
        { email: email.toLowerCase().trim() },
        { mobile: mobile.trim() },
      ],
    });

    if (existing) {
      return errorResponse(res, 'Admin with same admin_name, email or mobile already exists', 'DUPLICATE_ADMIN', 409);
    }

    const salt = await bcrypt.genSalt(12);
    const password_hash = await bcrypt.hash(password, salt);

    const newAdmin = await Admin.create({
      admin_name: admin_name.toLowerCase().trim(),
      full_name: full_name.trim(),
      email: email.toLowerCase().trim(),
      mobile: mobile.trim(),
      password_hash,
      admin_role,
      permissions,
      is_active: true,
      two_factor_enabled: true,
      created_by_admin_id: req.admin_id,
    });

    await logAudit({
      adminId: req.admin_id,
      action: 'ADMIN_CREATED',
      targetType: 'ADMIN',
      targetId: newAdmin._id,
      after: { admin_name, admin_role, email },
      ipAddress: req.ip || '127.0.0.1',
    });

    return successResponse(res, 'Admin created successfully', newAdmin, null, 201);
  } catch (error) {
    console.error('Create admin error:', error);
    return errorResponse(res, error.message, 'SERVER_ERROR', 500);
  }
};

/**
 * Super Admin: List all admin staff accounts
 * GET /api/v1/admin/admins
 */
const getAdmins = async (req, res) => {
  try {
    const { role, is_active, page = 1, limit = 20, search } = req.query;
    const filter = {};

    if (role) filter.admin_role = role;
    if (is_active !== undefined) filter.is_active = is_active === 'true';
    if (search) {
      filter.$or = [
        { admin_name: { $regex: search, $options: 'i' } },
        { full_name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const total = await Admin.countDocuments(filter);
    const admins = await Admin.find(filter)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    return successResponse(res, 'Admin accounts fetched', admins, {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      total,
    });
  } catch (error) {
    return errorResponse(res, error.message, 'SERVER_ERROR', 500);
  }
};

/**
 * Super Admin: Update admin role, permissions, or is_active
 * PATCH /api/v1/admin/admins/:admin_id
 */
const updateAdmin = async (req, res) => {
  try {
    const { admin_id } = req.params;
    const { admin_role, permissions, is_active, full_name, mobile } = req.body;

    const admin = await Admin.findById(admin_id);
    if (!admin) {
      return errorResponse(res, 'Admin not found', 'ADMIN_NOT_FOUND', 404);
    }

    const before = {
      admin_role: admin.admin_role,
      permissions: admin.permissions,
      is_active: admin.is_active,
    };

    if (admin_role) {
      if (!ADMIN_ROLES.includes(admin_role)) {
        return errorResponse(res, 'Invalid admin role', 'INVALID_ROLE', 400);
      }
      admin.admin_role = admin_role;
    }
    if (permissions !== undefined) admin.permissions = permissions;
    if (is_active !== undefined) admin.is_active = is_active;
    if (full_name) admin.full_name = full_name;
    if (mobile) admin.mobile = mobile;

    await admin.save();

    await logAudit({
      adminId: req.admin_id,
      action: 'ADMIN_UPDATED',
      targetType: 'ADMIN',
      targetId: admin._id,
      before,
      after: {
        admin_role: admin.admin_role,
        permissions: admin.permissions,
        is_active: admin.is_active,
      },
      ipAddress: req.ip || '127.0.0.1',
    });

    return successResponse(res, 'Admin updated successfully', admin);
  } catch (error) {
    return errorResponse(res, error.message, 'SERVER_ERROR', 500);
  }
};

/**
 * Super Admin: Deactivate admin
 * DELETE /api/v1/admin/admins/:admin_id
 */
const deactivateAdmin = async (req, res) => {
  try {
    const { admin_id } = req.params;

    if (admin_id === req.admin_id) {
      return errorResponse(res, 'Cannot deactivate your own account', 'SELF_DEACTIVATION_DENIED', 400);
    }

    const admin = await Admin.findById(admin_id);
    if (!admin) {
      return errorResponse(res, 'Admin not found', 'ADMIN_NOT_FOUND', 404);
    }

    admin.is_active = false;
    await admin.save();

    await logAudit({
      adminId: req.admin_id,
      action: 'ADMIN_DEACTIVATED',
      targetType: 'ADMIN',
      targetId: admin._id,
      ipAddress: req.ip || '127.0.0.1',
    });

    return successResponse(res, 'Admin deactivated successfully');
  } catch (error) {
    return errorResponse(res, error.message, 'SERVER_ERROR', 500);
  }
};

module.exports = {
  createAdmin,
  getAdmins,
  updateAdmin,
  deactivateAdmin,
};
