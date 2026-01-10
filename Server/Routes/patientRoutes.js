const express = require('express');
const router = express.Router();
const patientController = require('../Controller/PatientController');

// ĐỊNH NGHĨA ROUTE
// GET http://localhost:PORT/api/patient/:patientId/dashboard
router.get('/:patientId/dashboard', patientController.getPatientDashboardInfo);

// [MỚI] Route lấy danh sách đơn thuốc
router.get('/:patientId/prescriptions', patientController.getPatientPrescriptions);

// [MỚI] Route gửi yêu cầu tư vấn
router.post('/:patientId/request-consultation', patientController.requestConsultation);

// [MỚI] Lấy thông tin tư vấn gần nhất
router.get('/:patientId/latest-consultation', patientController.getLatestConsultation);
module.exports = router;