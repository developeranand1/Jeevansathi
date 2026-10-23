const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Profile = require('../models/Profile');
const generateMatrimonyId = require('../utils/generateMatrimonyId');
const { signUserAccessToken, signUserRefreshToken } = require('../services/token.service');
const { successResponse, errorResponse } = require('../utils/response');

/**
 * User Registration
 * POST /api/v1/auth/register
 */
const register = async (req, res) => {
  try {
    const {
      full_name,
      user_name,
      mobile,
      email,
      password,
      profile_for = 'SELF',
      gender = 'BRIDE',
      date_of_birth,
      religion = 'Hindu',
      mother_tongue = 'Hindi',
      city = 'Delhi',
      highest_education = 'B.Tech',
      employed_in = 'PRIVATE',
      height_cm = 165,
      marital_status = 'NEVER_MARRIED',
    } = req.body;

    if (!full_name || !user_name || !email || !mobile || !password) {
      return errorResponse(res, 'All essential fields are required', 'VALIDATION_ERROR', 400);
    }

    // Check existing
    const existing = await User.findOne({
      $or: [
        { user_name: user_name.toLowerCase().trim() },
        { email: email.toLowerCase().trim() },
        { mobile: mobile.trim() },
      ],
    });

    if (existing) {
      return errorResponse(res, 'User with same username, email or mobile already exists', 'DUPLICATE_USER', 409);
    }

    const salt = await bcrypt.genSalt(12);
    const password_hash = await bcrypt.hash(password, salt);
    const matrimony_id = generateMatrimonyId();

    const user = await User.create({
      matrimony_id,
      user_name: user_name.toLowerCase().trim(),
      full_name: full_name.trim(),
      email: email.toLowerCase().trim(),
      mobile: mobile.trim(),
      password_hash,
      role: 'USER',
      account_status: 'ACTIVE',
      is_premium: false,
      profile_completion_percent: 65,
    });

    // Create Initial Profile
    const dob = date_of_birth ? new Date(date_of_birth) : new Date('1998-05-15');
    await Profile.create({
      user_id: user._id,
      matrimony_id,
      profile_for,
      personal: {
        full_name: full_name.trim(),
        gender,
        date_of_birth: dob,
        height_cm: Number(height_cm) || 165,
        marital_status,
        diet: 'VEG',
      },
      location: {
        country: 'India',
        state: 'Delhi',
        city,
      },
      religion_caste: {
        religion,
        mother_tongue,
        caste: 'General',
      },
      education_career: {
        highest_education,
        employed_in,
        profession: 'Professional',
      },
      profile_status: 'LIVE',
    });

    const access_token = signUserAccessToken(user);
    const refresh_token = signUserRefreshToken(user);

    return successResponse(res, 'Registration successful', {
      access_token,
      refresh_token,
      user,
    }, null, 201);
  } catch (error) {
    console.error('Registration error:', error);
    return errorResponse(res, error.message, 'SERVER_ERROR', 500);
  }
};

/**
 * User Login
 * POST /api/v1/auth/login
 */
const login = async (req, res) => {
  try {
    const { login_id, password } = req.body;

    if (!login_id || !password) {
      return errorResponse(res, 'login_id and password are required', 'AUTH_MISSING_CREDENTIALS', 400);
    }

    const cleanLoginId = login_id.trim();

    const user = await User.findOne({
      $or: [
        { user_name: cleanLoginId.toLowerCase() },
        { email: cleanLoginId.toLowerCase() },
        { matrimony_id: cleanLoginId.toUpperCase() },
        { mobile: cleanLoginId },
      ],
    }).select('+password_hash');

    if (!user) {
      return errorResponse(res, 'Invalid credentials', 'AUTH_INVALID_CREDENTIALS', 401);
    }

    if (user.account_status === 'BANNED' || user.account_status === 'SUSPENDED') {
      return errorResponse(res, `Account is ${user.account_status}. Please contact support.`, 'ACCOUNT_RESTRICTED', 403);
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      user.failed_login_attempts = (user.failed_login_attempts || 0) + 1;
      await user.save();
      return errorResponse(res, 'Invalid credentials', 'AUTH_INVALID_CREDENTIALS', 401);
    }

    user.failed_login_attempts = 0;
    user.last_login_at = new Date();
    await user.save();

    const access_token = signUserAccessToken(user);
    const refresh_token = signUserRefreshToken(user);

    return successResponse(res, 'Login successful', {
      access_token,
      refresh_token,
      user,
    });
  } catch (error) {
    console.error('User login error:', error);
    return errorResponse(res, error.message, 'SERVER_ERROR', 500);
  }
};

/**
 * Get Profile & Active Membership for Logged In User
 * GET /api/v1/auth/me
 */
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user_id);
    if (!user) {
      return errorResponse(res, 'User not found', 'USER_NOT_FOUND', 404);
    }
    const profile = await Profile.findOne({ user_id: req.user_id });
    return successResponse(res, 'User details fetched', { user, profile });
  } catch (error) {
    return errorResponse(res, error.message, 'SERVER_ERROR', 500);
  }
};

module.exports = {
  register,
  login,
  getMe,
};
