const { verifyAdminToken } = require('../services/token.service');
const { errorResponse } = require('../utils/response');

const adminAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'Authentication token required', 'AUTH_TOKEN_MISSING', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAdminToken(token);

    if (decoded.type !== 'ADMIN') {
      return errorResponse(res, 'Admin token required', 'FORBIDDEN_NOT_ADMIN', 403);
    }

    req.auth = decoded;
    req.admin_id = decoded.sub;
    next();
  } catch (error) {
    return errorResponse(res, 'Invalid or expired token', 'AUTH_INVALID_TOKEN', 401);
  }
};

module.exports = adminAuth;
