USE [HospitalManagement]
GO

-- =======================================================
-- 1. TẮT RÀNG BUỘC & XÓA DỮ LIỆU CŨ
-- =======================================================
EXEC sp_msforeachtable 'ALTER TABLE ? NOCHECK CONSTRAINT all'
GO

-- Xóa theo thứ tự ngược để tránh sót
DELETE FROM PrescriptionItems;
DELETE FROM Prescriptions;
DELETE FROM MedicalRecords;
DELETE FROM EquipmentRequests;
DELETE FROM PatientRequests;
DELETE FROM ConsultationRequests;
DELETE FROM DoctorInstructions;
DELETE FROM Appointments;
DELETE FROM Equipments;
DELETE FROM Medicines;
DELETE FROM Patients;
DELETE FROM Staff;
DELETE FROM Users;

-- =======================================================
-- 2. RESET ID VỀ 0 (Để dòng đầu tiên chèn vào sẽ là 1)
-- =======================================================
DBCC CHECKIDENT ('Users', RESEED, 0);
DBCC CHECKIDENT ('Staff', RESEED, 0);
DBCC CHECKIDENT ('Patients', RESEED, 0);
DBCC CHECKIDENT ('Medicines', RESEED, 0);
DBCC CHECKIDENT ('Equipments', RESEED, 0);
DBCC CHECKIDENT ('Appointments', RESEED, 0);
DBCC CHECKIDENT ('MedicalRecords', RESEED, 0);
DBCC CHECKIDENT ('Prescriptions', RESEED, 0);
DBCC CHECKIDENT ('PrescriptionItems', RESEED, 0);
DBCC CHECKIDENT ('DoctorInstructions', RESEED, 0);
DBCC CHECKIDENT ('ConsultationRequests', RESEED, 0);
DBCC CHECKIDENT ('PatientRequests', RESEED, 0);
DBCC CHECKIDENT ('EquipmentRequests', RESEED, 0);

-- =======================================================
-- 3. TẠO USERS (45 Users)
-- =======================================================
-- 1 Admin (ID 1)
INSERT INTO Users (Username, PasswordHash, Email, Role) VALUES 
('admin', '123456', 'admin@hms.com', 'Admin');

-- 12 Bác sĩ (ID 2 -> 13)
INSERT INTO Users (Username, PasswordHash, Email, Role) VALUES 
('doc_01', '123456', 'doc1@hms.com', 'Doctor'), ('doc_02', '123456', 'doc2@hms.com', 'Doctor'), 
('doc_03', '123456', 'doc3@hms.com', 'Doctor'), ('doc_04', '123456', 'doc4@hms.com', 'Doctor'), 
('doc_05', '123456', 'doc5@hms.com', 'Doctor'), ('doc_06', '123456', 'doc6@hms.com', 'Doctor'), 
('doc_07', '123456', 'doc7@hms.com', 'Doctor'), ('doc_08', '123456', 'doc8@hms.com', 'Doctor'),
('doc_09', '123456', 'doc9@hms.com', 'Doctor'), ('doc_10', '123456', 'doc10@hms.com', 'Doctor'), 
('doc_11', '123456', 'doc11@hms.com', 'Doctor'), ('doc_12', '123456', 'doc12@hms.com', 'Doctor');

-- 12 Y tá (ID 14 -> 25)
INSERT INTO Users (Username, PasswordHash, Email, Role) VALUES 
('nurse_01', '123456', 'nur1@hms.com', 'Nurse'), ('nurse_02', '123456', 'nur2@hms.com', 'Nurse'), 
('nurse_03', '123456', 'nur3@hms.com', 'Nurse'), ('nurse_04', '123456', 'nur4@hms.com', 'Nurse'),
('nurse_05', '123456', 'nur5@hms.com', 'Nurse'), ('nurse_06', '123456', 'nur6@hms.com', 'Nurse'), 
('nurse_07', '123456', 'nur7@hms.com', 'Nurse'), ('nurse_08', '123456', 'nur8@hms.com', 'Nurse'),
('nurse_09', '123456', 'nur9@hms.com', 'Nurse'), ('nurse_10', '123456', 'nur10@hms.com', 'Nurse'), 
('nurse_11', '123456', 'nur11@hms.com', 'Nurse'), ('nurse_12', '123456', 'nur12@hms.com', 'Nurse');

-- 20 Bệnh nhân (ID 26 -> 45)
INSERT INTO Users (Username, PasswordHash, Email, Role) VALUES 
('pat_01', '123456', 'pat1@hms.com', 'Patient'), ('pat_02', '123456', 'pat2@hms.com', 'Patient'), 
('pat_03', '123456', 'pat3@hms.com', 'Patient'), ('pat_04', '123456', 'pat4@hms.com', 'Patient'), 
('pat_05', '123456', 'pat5@hms.com', 'Patient'), ('pat_06', '123456', 'pat6@hms.com', 'Patient'), 
('pat_07', '123456', 'pat7@hms.com', 'Patient'), ('pat_08', '123456', 'pat8@hms.com', 'Patient'), 
('pat_09', '123456', 'pat9@hms.com', 'Patient'), ('pat_10', '123456', 'pat10@hms.com', 'Patient'),
('pat_11', '123456', 'pat11@hms.com', 'Patient'), ('pat_12', '123456', 'pat12@hms.com', 'Patient'), 
('pat_13', '123456', 'pat13@hms.com', 'Patient'), ('pat_14', '123456', 'pat14@hms.com', 'Patient'), 
('pat_15', '123456', 'pat15@hms.com', 'Patient'), ('pat_16', '123456', 'pat16@hms.com', 'Patient'), 
('pat_17', '123456', 'pat17@hms.com', 'Patient'), ('pat_18', '123456', 'pat18@hms.com', 'Patient'), 
('pat_19', '123456', 'pat19@hms.com', 'Patient'), ('pat_20', '123456', 'pat20@hms.com', 'Patient');

-- =======================================================
-- 4. STAFF (Khớp UserID)
-- =======================================================
-- UserID 1 là Admin
INSERT INTO Staff (UserID, FullName, Department, Specialization, Phone) VALUES 
(1, N'Quản Trị Viên Hệ Thống', N'Ban Giám Đốc', N'Quản trị', '0909000000');

-- UserID 2-13 (Bác sĩ)
INSERT INTO Staff (UserID, FullName, Department, Specialization, Phone) VALUES 
(2, N'BS Nguyễn Văn A', N'Khoa Nội', N'Tim mạch', '0909000001'), (3, N'BS Trần Văn B', N'Khoa Ngoại', N'Chấn thương', '0909000002'), 
(4, N'BS Lê Thị C', N'Khoa Nhi', N'Nhi khoa', '0909000003'), (5, N'BS Phạm Văn D', N'Khoa Sản', N'Sản phụ khoa', '0909000004'),
(6, N'BS Hoàng Văn E', N'Khoa Nội', N'Tiêu hóa', '0909000005'), (7, N'BS Ngô Thị F', N'Khoa Mắt', N'Nhãn khoa', '0909000006'), 
(8, N'BS Đặng Văn G', N'Khoa Tai Mũi Họng', N'TMH', '0909000007'), (9, N'BS Bùi Văn H', N'Khoa Da liễu', N'Da liễu', '0909000008'),
(10, N'BS Đỗ Thị I', N'Khoa Nội', N'Thần kinh', '0909000009'), (11, N'BS Hồ Văn K', N'Khoa Ngoại', N'Tiết niệu', '0909000010'), 
(12, N'BS Dương Văn L', N'Khoa Ung bướu', N'Ung bướu', '0909000011'), (13, N'BS Lý Thị M', N'Khoa Răng Hàm Mặt', N'Nha khoa', '0909000012');

-- UserID 14-25 (Y tá)
INSERT INTO Staff (UserID, FullName, Department, Specialization, Phone) VALUES 
(14, N'YT Nguyễn Thị N', N'Khoa Nội', NULL, '0909000013'), (15, N'YT Trần Văn O', N'Khoa Ngoại', NULL, '0909000014'), 
(16, N'YT Lê Thị P', N'Khoa Nhi', NULL, '0909000015'), (17, N'YT Phạm Văn Q', N'Khoa Sản', NULL, '0909000016'),
(18, N'YT Hoàng Thị R', N'Khoa Cấp cứu', NULL, '0909000017'), (19, N'YT Ngô Văn S', N'Khoa Hồi sức', NULL, '0909000018'), 
(20, N'YT Đặng Thị T', N'Khoa Nội', NULL, '0909000019'), (21, N'YT Bùi Văn U', N'Khoa Ngoại', NULL, '0909000020'),
(22, N'YT Đỗ Thị V', N'Khoa Nhi', NULL, '0909000021'), (23, N'YT Hồ Văn X', N'Khoa Sản', NULL, '0909000022'), 
(24, N'YT Dương Thị Y', N'Khoa Cấp cứu', NULL, '0909000023'), (25, N'YT Lý Văn Z', N'Khoa Hồi sức', NULL, '0909000024');

-- =======================================================
-- 5. PATIENTS (Khớp UserID 26-45)
-- =======================================================
INSERT INTO Patients (UserID, FullName, Gender, DoB, Phone, Address, InsuranceID, BloodGroup) VALUES 
(26, N'Nguyễn Thị Bệnh Nhân 1', 'Male', '1990-01-01', '0910000001', N'Hà Nội', 'BHYT01', 'A+'), (27, N'Trần Văn Bệnh Nhân 2', 'Female', '1992-02-02', '0910000002', N'TP.HCM', 'BHYT02', 'B+'), 
(28, N'Lê Thị Bệnh Nhân 3', 'Male', '1985-03-03', '0910000003', N'Đà Nẵng', 'BHYT03', 'O+'), (29, N'Phạm Văn Bệnh Nhân 4', 'Female', '1998-04-04', '0910000004', N'Cần Thơ', 'BHYT04', 'AB+'),
(30, N'Hoàng Thị Bệnh Nhân 5', 'Male', '2000-05-05', '0910000005', N'Hải Phòng', 'BHYT05', 'A-'), (31, N'Ngô Văn Bệnh Nhân 6', 'Female', '1993-06-06', '0910000006', N'Huế', 'BHYT06', 'B-'), 
(32, N'Đặng Thị Bệnh Nhân 7', 'Male', '1975-07-07', '0910000007', N'Nha Trang', 'BHYT07', 'O-'), (33, N'Bùi Văn Bệnh Nhân 8', 'Female', '1988-08-08', '0910000008', N'Vũng Tàu', 'BHYT08', 'AB-'),
(34, N'Đỗ Thị Bệnh Nhân 9', 'Male', '2005-09-09', '0910000009', N'Đà Lạt', 'BHYT09', 'A+'), (35, N'Hồ Văn Bệnh Nhân 10', 'Female', '1999-10-10', '0910000010', N'Sapa', 'BHYT10', 'B+'), 
(36, N'Dương Thị Bệnh Nhân 11', 'Male', '1982-11-11', '0910000011', N'Hạ Long', 'BHYT11', 'O+'), (37, N'Lý Văn Bệnh Nhân 12', 'Female', '1994-12-12', '0910000012', N'Phú Quốc', 'BHYT12', 'AB+'),
(38, N'Nguyễn Thị Bệnh Nhân 13', 'Male', '1991-01-13', '0910000013', N'Hội An', 'BHYT13', 'A-'), (39, N'Trần Văn Bệnh Nhân 14', 'Female', '1989-02-14', '0910000014', N'Mũi Né', 'BHYT14', 'B-'), 
(40, N'Lê Thị Bệnh Nhân 15', 'Male', '2002-03-15', '0910000015', N'Quy Nhơn', 'BHYT15', 'O-'), (41, N'Phạm Văn Bệnh Nhân 16', 'Female', '1997-04-16', '0910000016', N'Buôn Ma Thuột', 'BHYT16', 'AB-'),
(42, N'Hoàng Thị Bệnh Nhân 17', 'Male', '1980-05-17', '0910000017', N'Pleiku', 'BHYT17', 'A+'), (43, N'Ngô Văn Bệnh Nhân 18', 'Female', '1978-06-18', '0910000018', N'Tuy Hòa', 'BHYT18', 'B+'), 
(44, N'Đặng Thị Bệnh Nhân 19', 'Male', '2001-07-19', '0910000019', N'Đồng Hới', 'BHYT19', 'O+'), (45, N'Bùi Văn Bệnh Nhân 20', 'Female', '1996-08-20', '0910000020', N'Tam Kỳ', 'BHYT20', 'AB+');

-- =======================================================
-- 6. MEDICINES
-- =======================================================
INSERT INTO Medicines (Name, Unit, UnitPrice, StockQuantity, ExpiryDate) VALUES 
(N'Thuốc Paracetamol', N'Viên', 1000, 100, '2026-01-01'), (N'Thuốc Ibuprofen', N'Vỉ', 5000, 200, '2026-02-01'), 
(N'Thuốc Amoxicillin', N'Hộp', 20000, 50, '2026-03-01'), (N'Thuốc Cephalexin', N'Chai', 15000, 80, '2026-04-01'), 
(N'Thuốc Berberin', N'Tuýp', 12000, 60, '2026-05-01'), (N'Thuốc Vitamin C', N'Viên', 2000, 150, '2026-06-01'), 
(N'Thuốc Panadol', N'Vỉ', 6000, 250, '2026-07-01'), (N'Thuốc Omeprazole', N'Hộp', 25000, 70, '2026-08-01'), 
(N'Thuốc Metformin', N'Chai', 18000, 90, '2026-09-01'), (N'Thuốc Amlodipine', N'Tuýp', 14000, 100, '2026-10-01'),
(N'Thuốc Loratadine', N'Viên', 3000, 120, '2026-11-01'), (N'Thuốc Gaviscon', N'Vỉ', 7000, 220, '2026-12-01'), 
(N'Thuốc Eugica', N'Hộp', 30000, 40, '2027-01-01'), (N'Thuốc Salonpas', N'Chai', 20000, 85, '2027-02-01'), 
(N'Thuốc Betadine', N'Tuýp', 16000, 55, '2027-03-01'), (N'Thuốc Oresol', N'Viên', 4000, 180, '2027-04-01'), 
(N'Thuốc Smecta', N'Vỉ', 8000, 280, '2027-05-01'), (N'Thuốc Decolgen', N'Hộp', 35000, 30, '2027-06-01'), 
(N'Thuốc Insulin', N'Chai', 22000, 95, '2027-07-01'), (N'Thuốc Aspirin', N'Tuýp', 18000, 45, '2027-08-01'),
(N'Thuốc Clorpheniramin', N'Gói', 500, 1000, '2027-09-01'), (N'Thuốc Prednisolon', N'Ống', 5000, 300, '2027-10-01');

-- =======================================================
-- 7. EQUIPMENTS
-- =======================================================
INSERT INTO Equipments (Name, TotalQuantity, AvailableQuantity) VALUES 
(N'Máy đo huyết áp', 10, 10), (N'Nhiệt kế', 20, 20), (N'Xe lăn', 5, 5), (N'Cáng cứu thương', 5, 5), 
(N'Máy thở', 3, 3), (N'Máy siêu âm', 2, 2), (N'Máy X-quang', 1, 1), (N'Máy MRI', 1, 1), 
(N'Máy đo đường huyết', 15, 15), (N'Máy trợ tim', 4, 4), (N'Bình oxy', 10, 10), (N'Giường bệnh', 50, 50), 
(N'Đèn mổ', 2, 2), (N'Dao mổ điện', 5, 5), (N'Máy hút dịch', 8, 8), (N'Monitor theo dõi', 10, 10), 
(N'Bơm tiêm điện', 12, 12), (N'Máy lọc máu', 3, 3), (N'Kính hiển vi', 6, 6), (N'Máy ly tâm', 4, 4);

-- =======================================================
-- 8. APPOINTMENTS (Lịch hẹn)
-- =======================================================
INSERT INTO Appointments (PatientID, DoctorID, Date, StartTime, EndTime, Status) VALUES 
-- Lịch HÔM NAY (QUAN TRỌNG ĐỂ TEST DASHBOARD)
(1, 2, CAST(GETDATE() AS DATE), '08:00', '08:30', 'Pending'), 
(2, 3, CAST(GETDATE() AS DATE), '09:00', '09:30', 'Confirmed'), 
(3, 4, CAST(GETDATE() AS DATE), '10:00', '10:30', 'Completed'),
-- Lịch ngày mai/tương lai
(4, 5, DATEADD(DAY, 1, GETDATE()), '08:00', '08:30', 'Pending'), 
(5, 6, DATEADD(DAY, 1, GETDATE()), '09:00', '09:30', 'Confirmed'),
(8, 9, DATEADD(DAY, 2, GETDATE()), '10:00', '10:30', 'Confirmed'), 
(9, 10, DATEADD(DAY, 2, GETDATE()), '11:00', '11:30', 'Pending'),
-- Lịch quá khứ
(16, 5, '2023-12-01', '08:00', '08:30', 'Completed'), 
(17, 6, '2023-12-02', '09:00', '09:30', 'Completed');

-- =======================================================
-- 9. DOCTOR INSTRUCTIONS (Y lệnh)
-- =======================================================
INSERT INTO DoctorInstructions (DoctorID, PatientID, Content, Status) VALUES 
(2, 1, N'Theo dõi huyết áp 2h/lần', 'Pending'), (3, 2, N'Lấy máu xét nghiệm', 'Pending'), 
(4, 3, N'Chụp X-quang phổi', 'Completed'), (5, 4, N'Siêu âm ổ bụng', 'Pending'), 
(6, 5, N'Đo điện tim', 'Completed'), (7, 6, N'Thay băng vết thương', 'Pending'), 
(8, 7, N'Tiêm thuốc kháng sinh', 'Pending'), (9, 8, N'Truyền dịch 500ml', 'Completed'), 
(10, 9, N'Cho thở oxy', 'Pending'), (11, 10, N'Theo dõi đường huyết', 'Completed');

-- =======================================================
-- 10. CONSULTATION REQUESTS (Tư vấn)
-- =======================================================
INSERT INTO ConsultationRequests (PatientID, DoctorID, Title, Question, Response, Status) VALUES 
(1, 2, N'Đau đầu', N'Tôi hay bị đau đầu buổi sáng?', N'Nên đi đo huyết áp.', 'Replied'), 
(2, NULL, N'Đau bụng', N'Đau bụng âm ỉ vùng rốn?', NULL, 'Pending'),
(3, 3, N'Sốt', N'Trẻ sốt 39 độ uống thuốc gì?', N'Uống Paracetamol theo cân nặng.', 'Replied'), 
(4, NULL, N'Ho', N'Ho khan kéo dài?', NULL, 'Pending'),
(5, 4, N'Mẩn ngứa', N'Nổi mẩn đỏ sau khi ăn hải sản?', N'Dị ứng, uống kháng histamin.', 'Replied');

-- =======================================================
-- 11. PATIENT REQUESTS (Yêu cầu Y tá)
-- =======================================================
INSERT INTO PatientRequests (PatientID, NurseID, Content, Status) VALUES 
(1, 14, N'Xin thêm chăn', 'Completed'), (2, NULL, N'Hết nước uống', 'Pending'), 
(3, 15, N'Điều hòa hỏng', 'Processing'), (4, 16, N'Xin thay ga giường', 'Completed');

-- =======================================================
-- 12. EQUIPMENT REQUESTS (Yêu cầu thiết bị)
-- =======================================================
INSERT INTO EquipmentRequests (NurseID, EquipmentID, Quantity, Reason, Status) VALUES 
(14, 1, 1, N'Đo huyết áp phòng 101', 'Approved'), (15, 2, 2, N'Đo nhiệt độ phòng 102', 'Pending'), 
(16, 3, 1, N'Đưa BN đi chụp XQ', 'Approved');

-- =======================================================
-- 13. MEDICAL RECORDS & PRESCRIPTIONS
-- =======================================================
INSERT INTO MedicalRecords (PatientID, DoctorID, Diagnosis, TreatmentPlan) VALUES 
(1, 2, N'Bệnh A', N'Điều trị A'), (2, 3, N'Bệnh B', N'Điều trị B'), 
(3, 4, N'Bệnh C', N'Điều trị C'), (4, 5, N'Bệnh D', N'Điều trị D'), 
(5, 6, N'Bệnh E', N'Điều trị E');

INSERT INTO Prescriptions (RecordID, DoctorNote, TotalAmount) VALUES 
(1, N'Lưu ý 1', 100000), (2, N'Lưu ý 2', 200000), (3, N'Lưu ý 3', 150000), 
(4, N'Lưu ý 4', 300000), (5, N'Lưu ý 5', 250000);

-- Chi tiết đơn thuốc
INSERT INTO PrescriptionItems (PrescriptionID, MedicineID, Quantity, Dosage, PriceAtTime) VALUES 
(1, 1, 10, N'Sáng 1', 1000), (1, 2, 5, N'Chiều 1', 5000), 
(2, 3, 2, N'Sáng 1', 20000), (2, 4, 1, N'Tối 1', 15000),
(3, 5, 3, N'Sáng 1', 12000), (3, 6, 10, N'Chiều 2', 2000);

-- =======================================================
-- 14. BẬT LẠI RÀNG BUỘC
-- =======================================================
EXEC sp_msforeachtable 'ALTER TABLE ? CHECK CONSTRAINT all'
GO