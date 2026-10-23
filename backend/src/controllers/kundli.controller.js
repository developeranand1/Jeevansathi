const KundliMatch = require('../models/KundliMatch');
const User = require('../models/User');
const Profile = require('../models/Profile');
const { calculateGunaMilan } = require('../services/kundli.service');
const { successResponse, errorResponse } = require('../utils/response');

/**
 * Perform 36-Guna Kundli Milan between Groom and Bride
 * POST /api/v1/kundli/match
 * Body: { groom_user_id, bride_user_id, (optional: direct details) }
 */
const matchKundli = async (req, res) => {
  try {
    const { groom_user_id, bride_user_id, groom_name, bride_name, groom_rashi, bride_rashi, groom_nakshatra, bride_nakshatra } = req.body;

    let gRashi = groom_rashi;
    let bRashi = bride_rashi;
    let gNak = groom_nakshatra;
    let bNak = bride_nakshatra;

    // Fetch from profiles if user IDs provided
    if (groom_user_id && bride_user_id) {
      const [groomProf, brideProf] = await Promise.all([
        Profile.findOne({ user_id: groom_user_id }),
        Profile.findOne({ user_id: bride_user_id }),
      ]);
      if (groomProf?.astrology) {
        gRashi = gRashi || groomProf.astrology.rashi;
        gNak = gNak || groomProf.astrology.nakshatra;
      }
      if (brideProf?.astrology) {
        bRashi = bRashi || brideProf.astrology.rashi;
        bNak = bNak || brideProf.astrology.nakshatra;
      }
    }

    const result = calculateGunaMilan(gRashi, gNak, bRashi, bNak);

    // Save match result if user IDs available
    if (groom_user_id && bride_user_id) {
      await KundliMatch.findOneAndUpdate(
        { groom_user_id, bride_user_id },
        {
          guna_scores: result.guna_scores,
          total_score: result.total_score,
          manglik_dosha_match: result.manglik_dosha_match,
          verdict: result.verdict,
        },
        { upsert: true, new: true }
      );
    }

    return successResponse(res, 'Kundli Milan completed', {
      ...result,
      groom_details: { name: groom_name, rashi: gRashi, nakshatra: gNak },
      bride_details: { name: bride_name, rashi: bRashi, nakshatra: bNak },
    });
  } catch (error) {
    return errorResponse(res, error.message, 'SERVER_ERROR', 500);
  }
};

/**
 * Admin: Get Kundli Match Records
 * GET /api/v1/admin/kundli/matches
 */
const getMatchesHistory = async (req, res) => {
  try {
    const matches = await KundliMatch.find()
      .populate('groom_user_id', 'full_name user_name matrimony_id')
      .populate('bride_user_id', 'full_name user_name matrimony_id')
      .sort({ created_at: -1 })
      .limit(50);

    return successResponse(res, 'Kundli matches history fetched', matches);
  } catch (error) {
    return errorResponse(res, error.message, 'SERVER_ERROR', 500);
  }
};

module.exports = {
  matchKundli,
  getMatchesHistory,
};
