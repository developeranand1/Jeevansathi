const AuditLog = require('../models/AuditLog');

const logAudit = async ({ adminId, action, targetType, targetId, before = null, after = null, ipAddress = '127.0.0.1' }) => {
  try {
    await AuditLog.create({
      admin_id: adminId,
      action,
      target_type: targetType,
      target_id: targetId,
      before,
      after,
      ip_address: ipAddress,
    });
  } catch (err) {
    console.error('Audit log failed:', err.message);
  }
};

module.exports = {
  logAudit,
};
