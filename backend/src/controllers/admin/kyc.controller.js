const KycDocument = require('../../models/Kyc');
const Profile = require('../../models/Profile');
const { successResponse, errorResponse } = require('../../utils/response');
const { logAudit } = require('../../middlewares/auditLog');

/**
 * GET /api/v1/admin/kyc?status=PENDING
 */
const getKycList = async (req, res) => {
  try {
    const { status = 'PENDING', page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const total = await KycDocument.countDocuments(filter);
    const documents = await KycDocument.find(filter)
      .populate('user_id', 'full_name user_name matrimony_id email mobile')
      .sort({ submitted_at: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    return successResponse(res, 'KYC requests fetched', documents, {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      total,
    });
  } catch (error) {
    return errorResponse(res, error.message, 'SERVER_ERROR', 500);
  }
};

/**
 * PATCH /api/v1/admin/kyc/:kyc_id/approve
 */
const approveKyc = async (req, res) => {
  try {
    const { kyc_id } = req.params;
    const kyc = await KycDocument.findById(kyc_id);
    if (!kyc) {
      return errorResponse(res, 'KYC record not found', 'KYC_NOT_FOUND', 404);
    }

    kyc.status = 'APPROVED';
    kyc.reviewed_by_admin_id = req.admin_id;
    kyc.reviewed_at = new Date();
    await kyc.save();

    // Mark profile verified (blue tick)
    await Profile.findOneAndUpdate(
      { user_id: kyc.user_id },
      {
        'verification.is_id_verified': true,
        'verification.verified_by_admin_id': req.admin_id,
        'verification.verified_at': new Date(),
      }
    );

    await logAudit({
      adminId: req.admin_id,
      action: 'KYC_APPROVED',
      targetType: 'KYC',
      targetId: kyc._id,
      ipAddress: req.ip || '127.0.0.1',
    });

    return successResponse(res, 'KYC verified and approved', kyc);
  } catch (error) {
    return errorResponse(res, error.message, 'SERVER_ERROR', 500);
  }
};

/**
 * PATCH /api/v1/admin/kyc/:kyc_id/reject
 * Body: { reject_reason }
 */
const rejectKyc = async (req, res) => {
  try {
    const { kyc_id } = req.params;
    const { reject_reason } = req.body;

    if (!reject_reason) {
      return errorResponse(res, 'reject_reason is required', 'VALIDATION_ERROR', 400);
    }

    const kyc = await KycDocument.findById(kyc_id);
    if (!kyc) {
      return errorResponse(res, 'KYC record not found', 'KYC_NOT_FOUND', 404);
    }

    kyc.status = 'REJECTED';
    kyc.reject_reason = reject_reason;
    kyc.reviewed_by_admin_id = req.admin_id;
    kyc.reviewed_at = new Date();
    await kyc.save();

    await logAudit({
      adminId: req.admin_id,
      action: 'KYC_REJECTED',
      targetType: 'KYC',
      targetId: kyc._id,
      after: { reject_reason },
      ipAddress: req.ip || '127.0.0.1',
    });

    return successResponse(res, 'KYC rejected', kyc);
  } catch (error) {
    return errorResponse(res, error.message, 'SERVER_ERROR', 500);
  }
};

module.exports = {
  getKycList,
  approveKyc,
  rejectKyc,
};
