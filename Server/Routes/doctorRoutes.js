const express = require('express');
const router = express.Router();
// Đảm bảo đường dẫn import đúng với tên file thực tế của bạn
const doctorController = require('../Controller/DoctorController'); 

// 1. Lấy danh sách lịch khám
router.get('/appointments/:doctorId', doctorController.getAppointments);

// 2. Lấy danh sách thuốc (Mới thêm - Dùng cho menu chọn thuốc)
router.get('/medicines', doctorController.getMedicines);

// 3. Kê đơn thuốc
router.post('/prescribe', doctorController.prescribeMedication);

// 4. Xem lịch sử đơn thuốc của bệnh nhân
router.get('/history/:patientId', doctorController.getPrescriptionHistory);

// 5. Lấy danh sách bệnh nhân đang phụ trách
router.get('/my-patients/:doctorId', doctorController.getMyPatients);

// --- MỚI THÊM: PHỤC VỤ CHỨC NĂNG XEM VÀ CẬP NHẬT HỒ SƠ (UC005) ---

// 6. Lấy chi tiết đầy đủ thông tin hành chính và y tế của bệnh nhân
// Dùng khi ấn nút "Xem hồ sơ" từ danh sách
// GET: http://localhost:5000/api/doctor/patient-detail/1
router.get('/patient-detail/:patientId', doctorController.getPatientDetail);

// 7. Cập nhật thông tin chi tiết bệnh nhân
// Dùng khi ấn nút "Lưu thay đổi" trong giao diện chỉnh sửa hồ sơ
// PUT: http://localhost:5000/api/doctor/update-patient/1
router.put('/update-patient/:patientId', doctorController.updatePatientProfile);

// 8. Gửi chỉ thị mới cho điều dưỡng (Đã cập nhật Controller để nhận nurseId)
// POST: http://localhost:5000/api/doctor/send-instruction
router.post('/send-instruction', doctorController.sendInstruction);

// 9. Lấy lịch sử các chỉ thị điều dưỡng của một bệnh nhân
// GET: http://localhost:5000/api/doctor/instruction-history/1
router.get('/instruction-history/:patientId', doctorController.getInstructionHistory);

// 10. Lấy danh sách Điều dưỡng (Mới thêm - Để đổ dữ liệu vào ô chọn Nurse)
// GET: http://localhost:5000/api/doctor/nurses
router.get('/nurses', doctorController.getNurses);

module.exports = router;