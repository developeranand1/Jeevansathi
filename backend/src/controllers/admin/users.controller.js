const User = require('../../models/User');
const Profile = require('../../models/Profile');
const Subscription = require('../../models/Subscription');
const Payment = require('../../models/Payment');
const { successResponse, errorResponse } = require('../../utils/response');
const { logAudit } = require('../../middlewares/auditLog');

/**
 * GET /api/v1/admin/users
 * Filter by: status, is_premium, search (user_name/mobile/matrimony_id/full_name)
 */
const getUsers = async (req, res) => {
  try {
    const { status, is_premium, search, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (status) filter.account_status = status;
    if (is_premium !== undefined) filter.is_premium = is_premium === 'true';
    if (search) {
      filter.$or = [
        { user_name: { $regex: search, $options: 'i' } },
        { full_name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } },
        { matrimony_id: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    return successResponse(res, 'Users fetched successfully', users, {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      total,
    });
  } catch (error) {
    return errorResponse(res, error.message, 'SERVER_ERROR', 500);
  }
};

/**
 * GET /api/v1/admin/users/:user_id
 */
const getUserById = async (req, res) => {
  try {
    const { user_id } = req.params;
    const user = await User.findById(user_id);
    if (!user) {
      return errorResponse(res, 'User not found', 'USER_NOT_FOUND', 404);
    }

    const [profile, subscription, payments] = await Promise.all([
      Profile.findOne({ user_id }),
      Subscription.findOne({ user_id, status: 'ACTIVE' }).populate('plan_id'),
      Payment.find({ user_id }).sort({ created_at: -1 }).limit(10),
    ]);

    return successResponse(res, 'User details fetched', {
      user,
      profile,
      subscription,
      payments,
    });
  } catch (error) {
    return errorResponse(res, error.message, 'SERVER_ERROR', 500);
  }
};

/**
 * PATCH /api/v1/admin/users/:user_id/status
 * Body: { account_status, reason }
 */
const updateUserStatus = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { account_status, reason } = req.body;

    const user = await User.findById(user_id);
    if (!user) {
      return errorResponse(res, 'User not found', 'USER_NOT_FOUND', 404);
    }

    const before = { account_status: user.account_status, suspend_reason: user.suspend_reason };

    user.account_status = account_status;
    if (reason) user.suspend_reason = reason;
    if (account_status === 'DELETED') user.deleted_at = new Date();

    await user.save();

    await logAudit({
      adminId: req.admin_id,
      action: `USER_STATUS_${account_status}`,
      targetType: 'USER',
      targetId: user._id,
      before,
      after: { account_status, suspend_reason: user.suspend_reason },
      ipAddress: req.ip || '127.0.0.1',
    });

    return successResponse(res, `User status updated to ${account_status}`, user);
  } catch (error) {
    return errorResponse(res, error.message, 'SERVER_ERROR', 500);
  }
};

/**
 * DELETE /api/v1/admin/users/:user_id (Soft delete)
 */
const softDeleteUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const user = await User.findById(user_id);
    if (!user) {
      return errorResponse(res, 'User not found', 'USER_NOT_FOUND', 404);
    }

    user.account_status = 'DELETED';
    user.deleted_at = new Date();
    await user.save();

    await logAudit({
      adminId: req.admin_id,
      action: 'USER_DELETED',
      targetType: 'USER',
      targetId: user._id,
      ipAddress: req.ip || '127.0.0.1',
    });

    return successResponse(res, 'User soft-deleted successfully');
  } catch (error) {
    return errorResponse(res, error.message, 'SERVER_ERROR', 500);
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUserStatus,
  softDeleteUser,
};
