const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
router.get('/staff', adminController.getAllStaff);
router.post('/staff', adminController.createStaff);
module.exports = router;