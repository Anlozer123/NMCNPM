USE HospitalManagement;
GO

-- 1. Thêm dữ liệu Nhân viên (Staff)
-- Gồm 1 Admin, 1 Bác sĩ, 1 Y tá để test phân quyền Login
INSERT INTO Staff (FullName, DoB, Phone, Email, PasswordHash, Role, Specialization, AdminPrivilege)
VALUES 
(N'Nguyễn Quản Trị', '1990-01-01', '0901111111', 'admin@hms.com', '123456', 'Admin', NULL, 1),
(N'Bác sĩ Lê Chuyên Khoa', '1985-05-15', '0902222222', 'doctor@hms.com', '123456', 'Doctor', N'Nội khoa', 0),
(N'Y tá Trần Tận Tâm', '1995-08-20', '0903333333', 'nurse@hms.com', '123456', 'Nurse', NULL, 0);

-- 2. Thêm dữ liệu Bệnh nhân (Patient)
-- Thêm 2 bệnh nhân để test danh sách
-- Tìm đoạn INSERT INTO Patient và sửa thành:
INSERT INTO Patient (FullName, Gender, DoB, Phone, Email, Address, PasswordHash)
VALUES 
(N'Phạm Bệnh Nhân A', 'Male', '2000-02-10', '0904444444', 'benhnhana@email.com', N'123 Đường Lê Lợi', '123456'), -- Thêm data email
(N'Hoàng Bệnh Nhân B', 'Female', '1998-11-30', '0905555555', 'benhnhanb@email.com', N'456 Đường Nguyễn Huệ', '123456'); -- Thêm data email

-- 3. Thêm dữ liệu Thuốc (Medicine)
-- Để test chức năng Kê đơn (Prescription)
INSERT INTO Medicine (Name, UnitPrice, StockQuantity, ExpiryDate)
VALUES 
(N'Paracetamol 500mg', 1000, 500, '2026-12-31'),
(N'Amoxicillin 500mg', 2500, 200, '2026-06-30'),
(N'Vitamin C 1000mg', 5000, 100, '2025-12-31'),
(N'Ibuprofen 400mg', 3000, 300, '2027-01-15');

-- 4. Thêm dữ liệu Thiết bị (Equipment)
-- Để test chức năng Y tá yêu cầu thiết bị
INSERT INTO Equipment (Name, Status, Info, Quantity)
VALUES 
(N'Máy đo huyết áp', N'Tốt', N'Omron HEM-7121', 10),
(N'Xe lăn', N'Tốt', N'Inox tiêu chuẩn', 5),
(N'Máy trợ thở', N'Bảo trì', N'Philips Respironics', 2);

-- 5. Thêm Lịch làm việc (Schedule)
-- Để Bác sĩ thấy lịch làm việc trên Dashboard
INSERT INTO Schedule (StaffID, Room, WorkDate, StartTime, EndTime)
VALUES 
(2, N'Phòng 101', GETDATE(), '08:00:00', '17:00:00'); -- Lịch hôm nay cho Bác sĩ Lê

-- 6. Thêm Lịch hẹn khám (Appointment)
-- Để Bác sĩ thấy danh sách bệnh nhân chờ khám (UC007)
INSERT INTO Appointment (PatientID, DoctorID, AppointmentDate, Status, Reason)
VALUES 
(1, 2, DATEADD(hour, 1, GETDATE()), 'Pending', N'Đau đầu, chóng mặt'), -- Bệnh nhân A hẹn 1 tiếng nữa
(2, 2, DATEADD(day, 1, GETDATE()), 'Confirmed', N'Tái khám định kỳ');   -- Bệnh nhân B hẹn ngày mai

-- 7. Thêm Hồ sơ bệnh án mẫu (MedicalRecord)
-- Dữ liệu lịch sử để test AI Tóm tắt hoặc xem hồ sơ cũ
INSERT INTO MedicalRecord (PatientID, DoctorID, Diagnosis, Notes, Date)
VALUES 
(1, 2, N'Cảm cúm mùa', N'Bệnh nhân sốt nhẹ, ho khan. Đã kê thuốc hạ sốt.', DATEADD(month, -1, GETDATE()));

INSERT INTO DoctorInstruction (DoctorID, PatientID, Instruction, Status, CreatedAt)
VALUES 
(2, 1, N'Tiêm thuốc kháng sinh liều 2 sau ăn trưa', 'New', GETDATE()), 
(2, 2, N'Theo dõi nhịp tim mỗi 1 tiếng', 'New', GETDATE()),
(2, 1, N'Thay băng vết thương', 'Completed', DATEADD(hour, -2, GETDATE())); -- Đã làm xong

-- 9. Thêm dữ liệu cho UC013: Handle Patient Request (Xử lý yêu cầu bệnh nhân)
-- Giả định: Bệnh nhân A và B gửi yêu cầu từ App của họ.
-- Mục đích: Khi Nurse đăng nhập, sẽ thấy các yêu cầu này cần xử lý.
INSERT INTO PatientRequest (PatientID, NurseID, Content, Status, CreatedAt)
VALUES 
(1, NULL, N'Tôi thấy khó thở, cần hỗ trợ gấp', 'Pending', GETDATE()), -- Chưa có y tá nhận
(2, 3, N'Xin đổi ga giường mới', 'Processing', DATEADD(minute, -30, GETDATE())); -- Y tá (ID 3) đang xử lý

-- 10. Thêm dữ liệu cho UC011: Request Medical Equipment Supply (Yêu cầu vật tư)
-- Giả định: Y tá (ID 3) đã từng yêu cầu vật tư trước đó.
-- Mục đích: Để xem lại lịch sử yêu cầu vật tư.
INSERT INTO EquipmentRequest (StaffID, EquipmentID, Quantity, Urgency, Reason, Status, RequestDate)
VALUES 
(3, 1, 2, 'High', N'Máy đo huyết áp phòng 101 bị hỏng màn hình', 'Pending', GETDATE()),
(3, 2, 1, 'Normal', N'Cần thêm xe lăn cho khu vực sảnh chờ', 'Approved', DATEADD(day, -1, GETDATE()));

GO