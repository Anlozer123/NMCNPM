const express = require('express');
const router = express.Router();
const adminController = require('../Controller/AdminController');

router.get('/profile', adminController.getAdminProfile);

router.get('/work-schedule', adminController.getWorkSchedule);

router.get('/patients', adminController.getAllPatients);

router.post('/add-patient', adminController.addPatient);

router.put('/update-patient/:id', adminController.updatePatient);

router.get('/staff', adminController.getAllStaff);

router.post('/add-staff', adminController.addStaff);

router.put('/update-staff/:id', adminController.updateStaff);

module.exports = router;