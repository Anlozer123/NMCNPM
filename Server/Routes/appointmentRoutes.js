const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
router.post('/book', appointmentController.book);
module.exports = router;