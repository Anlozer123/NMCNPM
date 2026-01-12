const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
router.get('/:id/profile', patientController.getProfile);
router.get('/:id/history', patientController.getHistory);
router.post('/consultation', patientController.requestConsultation);
router.get('/:id/consultations', patientController.getConsultations);
router.post('/request-support', patientController.sendRequest);
module.exports = router;