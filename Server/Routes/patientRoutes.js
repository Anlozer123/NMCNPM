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

// [MỚI] Lấy danh sách bác sĩ (Dropdown)
// URL thực tế: /api/patient/doctors-list
router.get('/doctors-list', patientController.getDoctorsList);

// [MỚI] Các route quản lý Lịch hẹn (Appointments)
router.get('/:patientId/appointments', patientController.getPatientAppointments);
router.post('/:patientId/appointments', patientController.bookAppointment);
router.put('/appointments/:id/cancel', patientController.cancelAppointment); // Lưu ý route này không cần patientId ở giữa để gọn hơn
// [MỚI] Lấy full thông tin chat (Info + Messages)
router.get('/:patientId/latest-consultation-full', patientController.getLatestConsultationFull);

// [MỚI] Gửi tin nhắn trả lời (Chat tiếp)
// Lưu ý: URL này sẽ là /api/patient/consultation/:requestId/reply
router.post('/consultation/:requestId/reply', patientController.replyToConsultation);
// [MỚI] Route sửa tin nhắn
router.put('/consultation/message/:messageId', patientController.editMessage);
// [MỚI] Route xóa tin nhắn
router.delete('/consultation/message/:messageId', patientController.deleteMessage);
module.exports = router;