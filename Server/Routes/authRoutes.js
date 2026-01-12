const express = require('express');
const router = express.Router();
const authController = require('../Controller/authController');

// Định nghĩa API POST /api/auth/login
router.post('/login', authController.login);
router.post('/register', authController.register);
module.exports = router;