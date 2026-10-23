const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Public User Auth
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
