const express = require('express');
const router = express.Router();
const nurseController = require('../Controller/NurseController');

// Định nghĩa các đường dẫn

// Trang chủ cho y tá
router.get('/stats', nurseController.getNurseStats);

// UC010
router.get('/doctor-instructions', nurseController.getDoctorInstructions);

router.post('/complete-instruction', nurseController.completeInstruction);
//

// UC011
router.post('/request-equipment', nurseController.requestEquipment);

router.get('/equipments', nurseController.getEquipments);

router.get('/equipment-requests', nurseController.getEquipmentRequests);
//

// UC012
router.get('/my-patients', nurseController.getMyPatients);
//

// UC013
router.get('/patient-requests', nurseController.getPatientRequests);

router.post('/handle-request', nurseController.handleRequest);
//

module.exports = router;