const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');

// Create payment order
router.post('/create-order', paymentController.createOrder);

// Verify payment and activate subscription
router.post('/verify', paymentController.verifyPayment);

module.exports = router;

