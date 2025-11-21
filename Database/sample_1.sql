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
INSERT INTO Patient (FullName, Gender, DoB, Phone, Address, PasswordHash)
VALUES 
(N'Phạm Bệnh Nhân A', 'Male', '2000-02-10', '0904444444', N'123 Đường Lê Lợi, TP.HCM', '123456'),
(N'Hoàng Bệnh Nhân B', 'Female', '1998-11-30', '0905555555', N'456 Đường Nguyễn Huệ, TP.HCM', '123456');

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

GO