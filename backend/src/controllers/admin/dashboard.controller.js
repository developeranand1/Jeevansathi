const User = require('../../models/User');
const KycDocument = require('../../models/Kyc');
const Payment = require('../../models/Payment');
const Report = require('../../models/Report');
const Profile = require('../../models/Profile');
const { successResponse, errorResponse } = require('../../utils/response');

const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalUsers,
      todaySignups,
      premiumUsers,
      pendingKyc,
      openReports,
      revenueResult,
    ] = await Promise.all([
      User.countDocuments({ account_status: { $ne: 'DELETED' } }),
      User.countDocuments({ created_at: { $gte: today } }),
      User.countDocuments({ is_premium: true }),
      KycDocument.countDocuments({ status: 'PENDING' }),
      Report.countDocuments({ status: 'OPEN' }),
      Payment.aggregate([
        { $match: { status: 'PAID' } },
        { $group: { _id: null, totalRevenue: { $sum: '$total_paid_inr' } } },
      ]),
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    return successResponse(res, 'Dashboard statistics fetched', {
      total_users: totalUsers,
      today_signups: todaySignups,
      premium_users: premiumUsers,
      pending_kyc: pendingKyc,
      open_reports: openReports,
      total_revenue_inr: totalRevenue,
    });
  } catch (error) {
    return errorResponse(res, error.message, 'SERVER_ERROR', 500);
  }
};

module.exports = {
  getDashboardStats,
};
