const { errorResponse } = require('../utils/response');

const allow = (...roles) => (req, res, next) => {
  if (!req.auth || req.auth.type !== 'ADMIN') {
    return errorResponse(res, 'Admin access only', 'FORBIDDEN_NOT_ADMIN', 403);
  }

  // SUPER_ADMIN has master override
  if (req.auth.role === 'SUPER_ADMIN') {
    return next();
  }

  if (!roles.includes(req.auth.role)) {
    return errorResponse(res, 'Role not authorized for this action', 'ROLE_NOT_ALLOWED', 403);
  }

  next();
};

module.exports = allow;
module.exports.allow = allow;
