const SubscriptionPlan = require('../../models/Plan');
const { successResponse, errorResponse } = require('../../utils/response');
const { logAudit } = require('../../middlewares/auditLog');

/**
 * GET /api/v1/admin/plans
 */
const getPlans = async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find().sort({ price_inr: 1 });
    return successResponse(res, 'Subscription plans fetched', plans);
  } catch (error) {
    return errorResponse(res, error.message, 'SERVER_ERROR', 500);
  }
};

/**
 * POST /api/v1/admin/plans
 */
const createPlan = async (req, res) => {
  try {
    const {
      plan_code,
      plan_name,
      price_inr,
      gst_percent = 18,
      duration_days,
      contact_views_limit,
      interests_limit,
      features = [],
      has_relationship_manager = false,
      is_active = true,
      subtitle = '',
      badge = '',
      is_popular = false,
    } = req.body;

    if (!plan_code || !plan_name || price_inr === undefined || !duration_days) {
      return errorResponse(res, 'Required fields missing', 'VALIDATION_ERROR', 400);
    }

    const existing = await SubscriptionPlan.findOne({ plan_code: plan_code.toUpperCase().trim() });
    if (existing) {
      return errorResponse(res, 'Plan code already exists', 'DUPLICATE_PLAN', 409);
    }

    const plan = await SubscriptionPlan.create({
      plan_code: plan_code.toUpperCase().trim(),
      plan_name,
      price_inr,
      gst_percent,
      duration_days,
      contact_views_limit,
      interests_limit,
      features,
      has_relationship_manager,
      is_active,
      subtitle,
      badge,
      is_popular,
      created_by_admin_id: req.admin_id,
    });

    await logAudit({
      adminId: req.admin_id,
      action: 'PLAN_CREATED',
      targetType: 'PLAN',
      targetId: plan._id,
      after: { plan_code, price_inr },
      ipAddress: req.ip || '127.0.0.1',
    });

    return successResponse(res, 'Subscription plan created', plan, null, 201);
  } catch (error) {
    return errorResponse(res, error.message, 'SERVER_ERROR', 500);
  }
};

/**
 * PUT / PATCH /api/v1/admin/plans/:plan_id
 */
const updatePlan = async (req, res) => {
  try {
    const { plan_id } = req.params;
    const plan = await SubscriptionPlan.findByIdAndUpdate(plan_id, req.body, { new: true });
    if (!plan) {
      return errorResponse(res, 'Plan not found', 'PLAN_NOT_FOUND', 404);
    }

    await logAudit({
      adminId: req.admin_id,
      action: 'PLAN_UPDATED',
      targetType: 'PLAN',
      targetId: plan._id,
      ipAddress: req.ip || '127.0.0.1',
    });

    return successResponse(res, 'Subscription plan updated', plan);
  } catch (error) {
    return errorResponse(res, error.message, 'SERVER_ERROR', 500);
  }
};

/**
 * DELETE /api/v1/admin/plans/:plan_id
 */
const deletePlan = async (req, res) => {
  try {
    const { plan_id } = req.params;
    const plan = await SubscriptionPlan.findByIdAndDelete(plan_id);
    if (!plan) {
      return errorResponse(res, 'Plan not found', 'PLAN_NOT_FOUND', 404);
    }

    await logAudit({
      adminId: req.admin_id,
      action: 'PLAN_DELETED',
      targetType: 'PLAN',
      targetId: plan._id,
      ipAddress: req.ip || '127.0.0.1',
    });

    return successResponse(res, 'Subscription plan deleted');
  } catch (error) {
    return errorResponse(res, error.message, 'SERVER_ERROR', 500);
  }
};

module.exports = {
  getPlans,
  createPlan,
  updatePlan,
  deletePlan,
};
