USE HospitalManagement;
GO

-- =============================================
-- 1. SEED TABLE: Staff (10 records)
-- =============================================
SET IDENTITY_INSERT Staff ON;
INSERT INTO Staff (StaffID, FullName, DoB, Phone, Email, PasswordHash, Role, Specialization, AdminPrivilege) VALUES 
(1, N'Nguyễn Quản Trị', '1990-01-01', '0901111111', 'admin@hms.com', '123456', 'Admin', NULL, 1),
(2, N'Bác sĩ Lê Chuyên Khoa', '1985-05-15', '0902222222', 'doctor@hms.com', '123456', 'Doctor', N'Nội khoa', 0),
(3, N'Y tá Trần Tận Tâm', '1995-08-20', '0903333333', 'nurse@hms.com', '123456', 'Nurse', NULL, 0),
(4, N'Bác sĩ Phạm Tim Mạch', '1980-02-10', '0904444441', 'dr.pham@hms.com', '123456', 'Doctor', N'Tim mạch', 0),
(5, N'Bác sĩ Ngô Thần Kinh', '1982-11-25', '0904444442', 'dr.ngo@hms.com', '123456', 'Doctor', N'Thần kinh', 0),
(6, N'Bác sĩ Vũ Xương Khớp', '1978-07-14', '0904444443', 'dr.vu@hms.com', '123456', 'Doctor', N'Chấn thương chỉnh hình', 0),
(7, N'Y tá Lý Chu Đáo', '1996-09-05', '0905555551', 'nurse.ly@hms.com', '123456', 'Nurse', NULL, 0),
(8, N'Y tá Hoà Vui Vẻ', '1997-12-12', '0905555552', 'nurse.hoa@hms.com', '123456', 'Nurse', NULL, 0),
(9, N'Y tá Mai Nhiệt Tình', '1998-03-30', '0905555553', 'nurse.mai@hms.com', '123456', 'Nurse', NULL, 0),
(10, N'Nguyễn Admin Phó', '1992-06-20', '0901111112', 'admin2@hms.com', '123456', 'Admin', NULL, 1);
SET IDENTITY_INSERT Staff OFF;

-- =============================================
-- 2. SEED TABLE: Patient (10 records)
-- =============================================
INSERT INTO [dbo].[Patient] (
    [FullName], [Gender], [DoB], [Phone], [Email], [Address], [PasswordHash], [CurrentRoom], [NurseID],
    [InsuranceID], [BloodGroup], [Allergies], [MedicalHistory], [AdmissionDiagnosis], [CurrentCondition],
    [RelativeName], [RelativePhone], [Relationship],
    [Height], [Weight], [HeartRate], [BloodSugar], [SystolicBP], [DiastolicBP]
) VALUES 
(N'Phạm Bệnh Nhân A', 'Male', '2000-02-10', '0904444444', 'benhnhana@email.com', N'123 Đường Lê Lợi, TP.HCM', '123456', '301', 3, 
 N'BHYT-001-A', 'O+', N'Không', N'Tăng huyết áp nhẹ', N'Viêm phổi nhẹ', N'Ổn định', N'Phạm Văn Cha', '0901112223', N'Cha', 175.5, 70.0, 75, 95.5, 120, 80),
(N'Hoàng Bệnh Nhân B', 'Female', '1998-11-30', '0905555555', 'benhnhanb@email.com', N'456 Đường Nguyễn Huệ, TP.HCM', '123456', '301', 3, 
 N'BHYT-999-B', 'A-', N'Penicillin', N'Tiểu đường type 2', N'Suy nhược cơ thể', N'Hồi phục tốt', N'Hoàng Thị Mẹ', '0902223334', N'Mẹ', 160.0, 52.5, 82, 110.0, 115, 75),
(N'Lê Văn C', 'Male', '1985-05-20', '0906666661', 'vanc@email.com', N'789 Cách Mạng Tháng 8', '123456', '302', 7, 
 N'BHYT-003', 'B+', N'Hải sản', N'Đau dạ dày', N'Viêm dạ dày cấp', N'Đau âm ỉ', N'Nguyễn Thị Vợ', '0903334445', N'Vợ', 168.0, 65.0, 78, 90.0, 130, 85),
(N'Trần Thị D', 'Female', '1990-10-10', '0906666662', 'thid@email.com', N'12 Điện Biên Phủ', '123456', '302', 7, 
 N'BHYT-004', 'AB+', N'Không', N'Hen suyễn', N'Cơn hen cấp', N'Khó thở nhẹ', N'Trần Văn Chồng', '0904445556', N'Chồng', 155.0, 48.0, 88, 85.5, 110, 70),
(N'Nguyễn Văn E', 'Male', '1975-01-01', '0906666663', 'vane@email.com', N'34 Hai Bà Trưng', '123456', '303', 8, 
 N'BHYT-005', 'O-', N'Phấn hoa', N'Gout', N'Đau khớp ngón chân', N'Sưng tấy', N'Nguyễn Văn Con', '0905556667', N'Con', 170.0, 80.5, 72, 105.0, 140, 90),
(N'Vũ Thị F', 'Female', '2005-08-15', '0906666664', 'thif@email.com', N'56 Nam Kỳ Khởi Nghĩa', '123456', '303', 8, 
 N'BHYT-006', 'A+', N'Không', N'Không', N'Sốt xuất huyết', N'Sốt cao', N'Vũ Văn Bố', '0906667778', N'Bố', 162.0, 50.0, 105, 92.0, 100, 60),
(N'Đặng Văn G', 'Male', '1960-04-30', '0906666665', 'vang@email.com', N'78 Pasteur', '123456', '304', 9, 
 N'BHYT-007', 'B-', N'Aspirin', N'Cao huyết áp', N'Tai biến nhẹ', N'Đang tập vật lý trị liệu', N'Đặng Thị Con', '0907778889', N'Con', 165.0, 68.0, 65, 115.5, 150, 95),
(N'Bùi Thị H', 'Female', '1988-12-24', '0906666666', 'thih@email.com', N'90 Võ Văn Tần', '123456', '304', 9, 
 N'BHYT-008', 'O+', N'Lông mèo', N'Viêm xoang', N'Viêm xoang mãn tính', N'Nghẹt mũi', N'Bùi Văn Em', '0908889990', N'Em trai', 158.0, 54.0, 80, 88.0, 118, 78),
(N'Phan Văn I', 'Male', '1999-07-07', '0906666667', 'vani@email.com', N'101 Nguyễn Thị Minh Khai', '123456', '305', 3, 
 N'BHYT-009', 'AB-', N'Không', N'Mổ ruột thừa', N'Nhiễm trùng vết mổ', N'Sốt nhẹ', N'Phan Thị Chị', '0909990001', N'Chị gái', 172.0, 63.5, 92, 98.0, 125, 82),
(N'Hồ Thị K', 'Female', '2001-03-03', '0906666668', 'thik@email.com', N'202 Lý Tự Trọng', '123456', '305', 7, 
 N'BHYT-010', 'A+', N'Không', N'Thiếu máu', N'Chóng mặt, ngất', N'Tỉnh táo', N'Hồ Văn Anh', '0901110002', N'Anh trai', 163.0, 47.0, 85, 82.5, 105, 65);

-- =============================================
-- 3. SEED TABLE: Medicine (10 records)
-- =============================================
INSERT INTO Medicine (Name, UnitPrice, StockQuantity, ExpiryDate) VALUES 
(N'Paracetamol 500mg', 1000, 500, '2026-12-31'),
(N'Amoxicillin 500mg', 2500, 200, '2026-06-30'),
(N'Vitamin C 1000mg', 5000, 100, '2025-12-31'),
(N'Ibuprofen 400mg', 3000, 300, '2027-01-15'),
(N'Omeprazole 20mg', 4000, 150, '2026-09-20'),
(N'Metformin 850mg', 2000, 400, '2026-11-11'),
(N'Amlodipine 5mg', 1500, 600, '2027-02-28'),
(N'Berberin 10mg', 500, 1000, '2028-01-01'),
(N'Augmentin 625mg', 15000, 50, '2025-10-10'),
(N'Panadol Extra', 1200, 300, '2026-05-05');

-- =============================================
-- 4. SEED TABLE: Equipment (10 records)
-- =============================================
INSERT INTO Equipment (Name, Status, Info, Quantity) VALUES 
(N'Máy đo huyết áp', N'Tốt', N'Omron HEM-7121', 10),
(N'Xe lăn', N'Tốt', N'Inox tiêu chuẩn', 5),
(N'Máy trợ thở', N'Bảo trì', N'Philips Respironics', 2),
(N'Máy đo đường huyết', N'Tốt', N'Accu-Chek', 8),
(N'Giường bệnh nhân', N'Tốt', N'Giường Inox 1 tay quay', 20),
(N'Nhiệt kế điện tử', N'Tốt', N'Microlife', 15),
(N'Máy ECG (Điện tâm đồ)', N'Hỏng', N'Nihon Kohden', 1),
(N'Đèn mổ', N'Tốt', N'Led', 3),
(N'Bơm tiêm điện', N'Bảo trì', N'Terumo', 5),
(N'Máy siêu âm', N'Tốt', N'GE Healthcare', 2);

-- =============================================
-- 5. SEED TABLE: Schedule (10 records)
-- =============================================
INSERT INTO Schedule (StaffID, Room, WorkDate, StartTime, EndTime) VALUES 
(2, N'Phòng 101', GETDATE(), '08:00:00', '17:00:00'),
(3, N'Phòng 301', GETDATE(), '07:00:00', '15:00:00'),
(4, N'Phòng 102', GETDATE(), '08:00:00', '17:00:00'),
(5, N'Phòng 103', GETDATE(), '13:00:00', '21:00:00'),
(6, N'Phòng 104', GETDATE(), '08:00:00', '17:00:00'),
(7, N'Phòng 302', GETDATE(), '07:00:00', '15:00:00'),
(8, N'Phòng 303', GETDATE(), '14:00:00', '22:00:00'),
(9, N'Phòng 304', GETDATE(), '22:00:00', '06:00:00'),
(2, N'Phòng 101', DATEADD(day, 1, GETDATE()), '08:00:00', '17:00:00'),
(3, N'Phòng 301', DATEADD(day, 1, GETDATE()), '07:00:00', '15:00:00');

-- =============================================
-- 6. SEED TABLE: Appointment (10 records)
-- =============================================
INSERT INTO Appointment (PatientID, DoctorID, AppointmentDate, Status, Reason) VALUES 
(1, 2, DATEADD(hour, 1, GETDATE()), 'Pending', N'Đau đầu, chóng mặt'),
(2, 2, DATEADD(day, 1, GETDATE()), 'Confirmed', N'Tái khám định kỳ'),
(3, 4, DATEADD(day, 2, GETDATE()), 'Pending', N'Đau ngực trái'),
(4, 5, DATEADD(day, 0, GETDATE()), 'Completed', N'Đau nửa đầu'),
(5, 6, DATEADD(day, 3, GETDATE()), 'Pending', N'Đau khớp gối'),
(6, 2, DATEADD(hour, 2, GETDATE()), 'Cancelled', N'Sốt cao'),
(7, 4, DATEADD(day, 1, GETDATE()), 'Confirmed', N'Kiểm tra huyết áp'),
(8, 2, DATEADD(day, 4, GETDATE()), 'Pending', N'Viêm họng'),
(9, 6, DATEADD(day, 5, GETDATE()), 'Pending', N'Tái khám gãy tay'),
(10, 5, DATEADD(day, 2, GETDATE()), 'Confirmed', N'Khám thần kinh');

-- =============================================
-- 7. SEED TABLE: MedicalRecord (10 records)
-- =============================================
INSERT INTO MedicalRecord (PatientID, DoctorID, Diagnosis, Notes, Date) VALUES 
(1, 2, N'Cảm cúm mùa', N'Sốt nhẹ, ho khan.', DATEADD(month, -1, GETDATE())),
(2, 2, N'Rối loạn tiền đình', N'Chóng mặt khi thay đổi tư thế.', DATEADD(month, -2, GETDATE())),
(3, 4, N'Viêm dạ dày', N'Đau vùng thượng vị.', DATEADD(day, -5, GETDATE())),
(4, 5, N'Hen phế quản', N'Khó thở về đêm.', DATEADD(day, -10, GETDATE())),
(5, 6, N'Gout cấp', N'Sưng đau ngón chân cái.', DATEADD(day, -2, GETDATE())),
(6, 2, N'Sốt xuất huyết', N'Tiểu cầu giảm nhẹ.', DATEADD(day, -3, GETDATE())),
(7, 4, N'Tăng huyết áp', N'Huyết áp 160/90.', DATEADD(day, -20, GETDATE())),
(8, 2, N'Viêm xoang', N'Đau nhức vùng mặt.', DATEADD(day, -15, GETDATE())),
(9, 6, N'Viêm ruột thừa', N'Đã phẫu thuật cắt bỏ.', DATEADD(month, -6, GETDATE())),
(10, 5, N'Thiếu máu não', N'Hay quên, đau đầu.', DATEADD(day, -7, GETDATE()));

-- =============================================
-- 8. SEED TABLE: Prescription & Items (10 records)
-- =============================================
INSERT INTO Prescription (RecordID, CreatedDate) VALUES (1, GETDATE()), (2, GETDATE()), (3, GETDATE()), (4, GETDATE()), (5, GETDATE()), (6, GETDATE()), (7, GETDATE()), (8, GETDATE()), (9, GETDATE()), (10, GETDATE());

INSERT INTO PrescriptionItem (PrescriptionID, MedicineID, Quantity, Dosage, Frequency, Duration, Note) VALUES 
(1, 1, 10, N'1 viên', N'Sáng - Chiều', N'5 ngày', N'Uống sau ăn'),
(2, 7, 30, N'1 viên', N'Sáng', N'30 ngày', N'Uống đúng giờ'),
(3, 5, 14, N'1 viên', N'Sáng - Tối', N'7 ngày', N'Uống trước ăn 30p');

-- =============================================
-- 9. SEED TABLE: DoctorInstruction (SỬA STATUS)
-- =============================================
INSERT INTO DoctorInstruction (DoctorID, PatientID, Instruction, NurseNote, Status) VALUES
(2, 1, N'Theo dõi nhiệt độ 4h/lần', N'Nhiệt độ ổn định 37 độ', 'Pending'),
(2, 1, N'Cho uống thuốc hạ sốt nếu sốt > 38.5', N'Đã thực hiện lúc 10h', 'Completed'),
(4, 7, N'Đo huyết áp mỗi 2h', N'HA 140/90', 'Pending'); -- Đã sửa 'In Progress' -> 'Pending'

-- =============================================
-- 10. SEED TABLE: PatientRequest (SỬA STATUS)
-- =============================================
INSERT INTO PatientRequest (PatientID, NurseID, Content, Status) VALUES
(1, 3, N'Xin thêm nước uống', 'Completed'),
(6, 7, N'Xin về sớm', 'Pending'),     -- Đã sửa 'Rejected' -> 'Pending'
(9, 3, N'Đau vết mổ', 'Processing');  -- Đã sửa 'Forwarded' -> 'Processing'

-- =============================================
-- 11. SEED TABLE: EquipmentRequest (SỬA URGENCY)
-- =============================================
INSERT INTO EquipmentRequest (StaffID, EquipmentID, PatientID, Quantity, Reason, Status, Urgency) VALUES
(3, 6, 1, 1, N'Nhiệt kế cũ bị hỏng', 'Pending', 'Normal'), -- Đã sửa 'Medium' -> 'Normal'
(8, 4, 2, 1, N'Máy đo đường huyết hết pin', 'Completed', 'Normal'), -- Đã sửa 'Medium' -> 'Normal'
(2, 1, 7, 1, N'Cần máy đo HA cơ', 'Approved', 'Normal'); -- Đã sửa 'Medium' -> 'Normal'

GO