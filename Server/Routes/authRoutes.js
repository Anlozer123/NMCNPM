const express = require('express');
const router = express.Router();
const authController = require('../Controller/authController');

// 1. API Đăng nhập
router.post('/login', authController.login);

// 2. API Kiểm tra tồn tại (Dùng cho Bước 1 - Register.js)
// Mục đích: Kiểm tra Email/SĐT có trùng không trước khi chuyển sang bước nhập thông tin chi tiết.
router.post('/check-existence', authController.checkExistence);

// 3. API Đăng ký tài khoản (Dùng cho Bước 2 - PatientDetails.js)
// Mục đích: Nhận toàn bộ dữ liệu (cả bước 1 và 2), kiểm tra logic nghiệp vụ và INSERT vào DB.
router.post('/register', authController.register);

module.exports = router;