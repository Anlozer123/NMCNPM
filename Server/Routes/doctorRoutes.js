const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
router.get('/:id/patients', doctorController.getMyPatients);
router.post('/prescribe', doctorController.prescribe);
router.post('/instruction', doctorController.sendInstruction);
router.get('/consultations', doctorController.getConsultations);
router.post('/consultation/:id/reply', doctorController.replyConsultation);
module.exports = router;