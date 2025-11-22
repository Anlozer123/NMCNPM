const express = require('express');
const router = express.Router();
const doctorController = require('../Controller/DoctorController');

// API: GET /api/doctor/appointments/:doctorId
router.get('/appointments/:doctorId', doctorController.getAppointments);

module.exports = router;