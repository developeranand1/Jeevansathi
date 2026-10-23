const express = require('express');
const router = express.Router();

const adminAuth = require('../middlewares/adminAuth');
const { allow } = require('../middlewares/allowRoles');

// Controllers
const adminAuthController = require('../controllers/admin/adminAuth.controller');
const staffController = require('../controllers/admin/staff.controller');
const dashboardController = require('../controllers/admin/dashboard.controller');
const usersController = require('../controllers/admin/users.controller');
const kycController = require('../controllers/admin/kyc.controller');
const plansController = require('../controllers/admin/plans.controller');
const kundliController = require('../controllers/kundli.controller');

// ==========================================
// 1. Direct Single-Step Admin Login (2FA Removed)
// ==========================================
router.post('/auth/login', adminAuthController.login);

// ==========================================
// 2. Protected Admin Auth Routes
// ==========================================
router.use(adminAuth);

router.post('/auth/logout', adminAuthController.logout);
router.get('/me', adminAuthController.getMe);

// ==========================================
// 3. Super Admin: Staff & Admin Management
// ==========================================
router.post('/admins', allow('SUPER_ADMIN'), staffController.createAdmin);
router.get('/admins', allow('SUPER_ADMIN'), staffController.getAdmins);
router.patch('/admins/:admin_id', allow('SUPER_ADMIN'), staffController.updateAdmin);
router.delete('/admins/:admin_id', allow('SUPER_ADMIN'), staffController.deactivateAdmin);

// ==========================================
// 4. Admin Dashboard
// ==========================================
router.get('/dashboard', dashboardController.getDashboardStats);

// ==========================================
// 5. Users Moderation
// ==========================================
router.get('/users', allow('SUPER_ADMIN', 'ADMIN', 'KYC_MODERATOR', 'SUPPORT_AGENT'), usersController.getUsers);
router.get('/users/:user_id', allow('SUPER_ADMIN', 'ADMIN', 'KYC_MODERATOR', 'SUPPORT_AGENT'), usersController.getUserById);
router.patch('/users/:user_id/status', allow('SUPER_ADMIN', 'ADMIN'), usersController.updateUserStatus);
router.delete('/users/:user_id', allow('SUPER_ADMIN', 'ADMIN'), usersController.softDeleteUser);

// ==========================================
// 6. KYC Moderation
// ==========================================
router.get('/kyc', allow('SUPER_ADMIN', 'ADMIN', 'KYC_MODERATOR'), kycController.getKycList);
router.patch('/kyc/:kyc_id/approve', allow('SUPER_ADMIN', 'ADMIN', 'KYC_MODERATOR'), kycController.approveKyc);
router.patch('/kyc/:kyc_id/reject', allow('SUPER_ADMIN', 'ADMIN', 'KYC_MODERATOR'), kycController.rejectKyc);

// ==========================================
// 7. Subscription Plans Management
// ==========================================
router.get('/plans', allow('SUPER_ADMIN', 'ADMIN', 'FINANCE_MANAGER'), plansController.getPlans);
router.post('/plans', allow('SUPER_ADMIN', 'ADMIN'), plansController.createPlan);
router.put('/plans/:plan_id', allow('SUPER_ADMIN', 'ADMIN'), plansController.updatePlan);
router.patch('/plans/:plan_id', allow('SUPER_ADMIN', 'ADMIN'), plansController.updatePlan);
router.delete('/plans/:plan_id', allow('SUPER_ADMIN', 'ADMIN'), plansController.deletePlan);

// ==========================================
// 8. Kundli Milan & Compatibility (All Admins)
// ==========================================
router.post('/kundli/match', kundliController.matchKundli);
router.get('/kundli/matches', kundliController.getMatchesHistory);

module.exports = router;
