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

-- 8. Thêm dữ liệu mẫu cho Đơn thuốc (Prescription)
-- Lấy RecordID = 1 (Hồ sơ bệnh án của Bệnh nhân A mà ta đã tạo ở mục 7)
INSERT INTO Prescription (RecordID, CreatedDate)
VALUES (1, GETDATE());

-- 9. Thêm chi tiết đơn thuốc (PrescriptionItem)
-- Giả sử đơn thuốc trên có ID = 1. Ta kê 2 loại thuốc:
-- Thuốc 1: Paracetamol (MedicineID = 1 trong bảng Medicine)
-- Thuốc 2: Vitamin C (MedicineID = 3 trong bảng Medicine)

INSERT INTO PrescriptionItem (PrescriptionID, MedicineID, Quantity, Dosage, Frequency, Duration, Note)
VALUES 
(1, 1, 10, N'1 viên', N'Sáng - Chiều', N'5 ngày', N'Uống sau ăn'),
(1, 3, 20, N'2 viên', N'Sáng - Tối', N'10 ngày', N'Uống nhiều nước');
GO