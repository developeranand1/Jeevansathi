const express = require('express');
const router = express.Router();

const adminRoutes = require('./admin.routes');
const authRoutes = require('./auth.routes');
const Plan = require('../models/Plan');

router.use('/admin', adminRoutes);
router.use('/auth', authRoutes);

// Public Plans for Frontend Home Page
router.get('/membership/plans', async (req, res) => {
  try {
    const plans = await Plan.find({ is_active: true }).sort({ price_inr: 1 });
    res.json({ success: true, message: 'Plans fetched', data: plans });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    service: 'Jeevansathi Matrimony API',
  });
});

module.exports = router;
