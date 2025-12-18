const express = require('express');
const router = express.Router();
// Đảm bảo đường dẫn import đúng với tên file thực tế của bạn
const doctorController = require('../Controller/DoctorController'); 

// 1. Lấy danh sách lịch khám
router.get('/appointments/:doctorId', doctorController.getAppointments);

// 2. Lấy danh sách thuốc (Mới thêm - Dùng cho menu chọn thuốc)
// GET: http://localhost:5000/api/doctor/medicines
router.get('/medicines', doctorController.getMedicines);

// 3. Kê đơn thuốc
router.post('/prescribe', doctorController.prescribeMedication);

// 4. Xem lịch sử đơn thuốc của bệnh nhân
// GET: http://localhost:5000/api/doctor/history/1
router.get('/history/:patientId', doctorController.getPrescriptionHistory);

router.get('/my-patients/:doctorId', doctorController.getMyPatients);

module.exports = router;