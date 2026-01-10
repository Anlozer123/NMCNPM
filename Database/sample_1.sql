USE HospitalManagement;
GO

-- =============================================
-- 1. SEED TABLE: Staff (10+ records)
-- =============================================
INSERT INTO Staff (FullName, DoB, Phone, Email, PasswordHash, Role, Specialization, AdminPrivilege) VALUES 
(N'Nguyễn Quản Trị', '1990-01-01', '0901111111', 'admin@hms.com', '123456', 'Admin', NULL, 1),
(N'Bác sĩ Lê Chuyên Khoa', '1985-05-15', '0902222222', 'doctor@hms.com', '123456', 'Doctor', N'Nội khoa', 0),
(N'Y tá Trần Tận Tâm', '1995-08-20', '0903333333', 'nurse@hms.com', '123456', 'Nurse', NULL, 0),
(N'Bác sĩ Phạm Tim Mạch', '1980-02-10', '0904444441', 'dr.pham@hms.com', '123456', 'Doctor', N'Tim mạch', 0),
(N'Bác sĩ Ngô Thần Kinh', '1982-11-25', '0904444442', 'dr.ngo@hms.com', '123456', 'Doctor', N'Thần kinh', 0),
(N'Bác sĩ Vũ Xương Khớp', '1978-07-14', '0904444443', 'dr.vu@hms.com', '123456', 'Doctor', N'Chấn thương chỉnh hình', 0),
(N'Y tá Lý Chu Đáo', '1996-09-05', '0905555551', 'nurse.ly@hms.com', '123456', 'Nurse', NULL, 0),
(N'Y tá Hoà Vui Vẻ', '1997-12-12', '0905555552', 'nurse.hoa@hms.com', '123456', 'Nurse', NULL, 0),
(N'Y tá Mai Nhiệt Tình', '1998-03-30', '0905555553', 'nurse.mai@hms.com', '123456', 'Nurse', NULL, 0),
(N'Nguyễn Admin Phó', '1992-06-20', '0901111112', 'admin2@hms.com', '123456', 'Admin', NULL, 1);

-- =============================================
-- 2. SEED TABLE: Patient (10+ records)
-- (Đã bao gồm thông tin update đầy đủ của BN A và B)
-- =============================================
INSERT INTO Patient (FullName, Gender, DoB, Phone, Email, Address, PasswordHash, CurrentRoom, NurseID, InsuranceID, BloodGroup, Allergies, MedicalHistory, AdmissionDiagnosis, CurrentCondition) VALUES 
(N'Phạm Bệnh Nhân A', 'Male', '2000-02-10', '0904444444', 'benhnhana@email.com', N'123 Đường Lê Lợi, TP.HCM', '123456', '301', 3, 'BHYT-001-A', 'O+', N'Không', N'Tăng huyết áp nhẹ', N'Viêm phổi nhẹ', N'Ổn định'),
(N'Hoàng Bệnh Nhân B', 'Female', '1998-11-30', '0905555555', 'benhnhanb@email.com', N'456 Đường Nguyễn Huệ, TP.HCM', '123456', '301', 3, 'BHYT-999-B', 'A-', N'Penicillin', N'Tiểu đường type 2', N'Suy nhược cơ thể', N'Hồi phục tốt'),
(N'Lê Văn C', 'Male', '1985-05-20', '0906666661', 'vanc@email.com', N'789 Cách Mạng Tháng 8', '123456', '302', 7, 'BHYT-003', 'B+', N'Hải sản', N'Đau dạ dày', N'Viêm dạ dày cấp', N'Đau âm ỉ'),
(N'Trần Thị D', 'Female', '1990-10-10', '0906666662', 'thid@email.com', N'12 Điện Biên Phủ', '123456', '302', 7, 'BHYT-004', 'AB+', N'Không', N'Hen suyễn', N'Cơn hen cấp', N'Khó thở nhẹ'),
(N'Nguyễn Văn E', 'Male', '1975-01-01', '0906666663', 'vane@email.com', N'34 Hai Bà Trưng', '123456', '303', 8, 'BHYT-005', 'O-', N'Phấn hoa', N'Gout', N'Đau khớp ngón chân', N'Sưng tấy'),
(N'Vũ Thị F', 'Female', '2005-08-15', '0906666664', 'thif@email.com', N'56 Nam Kỳ Khởi Nghĩa', '123456', '303', 8, 'BHYT-006', 'A+', N'Không', N'Không', N'Sốt xuất huyết', N'Sốt cao'),
(N'Đặng Văn G', 'Male', '1960-04-30', '0906666665', 'vang@email.com', N'78 Pasteur', '123456', '304', 9, 'BHYT-007', 'B-', N'Aspirin', N'Cao huyết áp', N'Tai biến nhẹ', N'Đang tập vật lý trị liệu'),
(N'Bùi Thị H', 'Female', '1988-12-24', '0906666666', 'thih@email.com', N'90 Võ Văn Tần', '123456', '304', 9, 'BHYT-008', 'O+', N'Lông mèo', N'Viêm xoang', N'Viêm xoang mãn tính', N'Nghẹt mũi'),
(N'Phan Văn I', 'Male', '1999-07-07', '0906666667', 'vani@email.com', N'101 Nguyễn Thị Minh Khai', '123456', '305', 3, 'BHYT-009', 'AB-', N'Không', N'Mổ ruột thừa', N'Nhiễm trùng vết mổ', N'Sốt nhẹ'),
(N'Hồ Thị K', 'Female', '2001-03-03', '0906666668', 'thik@email.com', N'202 Lý Tự Trọng', '123456', '305', 7, 'BHYT-010', 'A+', N'Không', N'Thiếu máu', N'Chóng mặt, ngất', N'Tỉnh táo');

-- =============================================
-- 3. SEED TABLE: Medicine (10+ records)
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
-- 4. SEED TABLE: Equipment (10+ records)
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
-- 5. SEED TABLE: Schedule (10+ records)
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
-- 6. SEED TABLE: WorkSchedule (10+ records)
-- =============================================
INSERT INTO WorkSchedule (StaffID, WorkDate, Note, ShiftType) VALUES
(2, GETDATE(), N'Trực ban ngày', N'Sáng'),
(3, GETDATE(), N'Chăm sóc bệnh nhân', N'Sáng'),
(4, GETDATE(), N'Trực phòng khám', N'Sáng'),
(5, GETDATE(), N'Trực phòng khám', N'Chiều'),
(6, GETDATE(), N'Trực phòng cấp cứu', N'Sáng'),
(7, GETDATE(), N'Chăm sóc bệnh nhân', N'Sáng'),
(8, GETDATE(), N'Chăm sóc bệnh nhân', N'Chiều'),
(9, GETDATE(), N'Trực đêm', N'Đêm'),
(2, DATEADD(day, 1, GETDATE()), N'Họp giao ban', N'Sáng'),
(3, DATEADD(day, 1, GETDATE()), N'Phát thuốc', N'Sáng');

-- =============================================
-- 7. SEED TABLE: Appointment (10+ records)
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
-- 8. SEED TABLE: MedicalRecord (10+ records)
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
-- 9. SEED TABLE: Prescription (10+ records - Link to MedicalRecords)
-- =============================================
INSERT INTO Prescription (RecordID, CreatedDate) VALUES 
(1, DATEADD(month, -1, GETDATE())),
(2, DATEADD(month, -2, GETDATE())),
(3, DATEADD(day, -5, GETDATE())),
(4, DATEADD(day, -10, GETDATE())),
(5, DATEADD(day, -2, GETDATE())),
(6, DATEADD(day, -3, GETDATE())),
(7, DATEADD(day, -20, GETDATE())),
(8, DATEADD(day, -15, GETDATE())),
(9, DATEADD(month, -6, GETDATE())),
(10, DATEADD(day, -7, GETDATE()));

-- =============================================
-- 10. SEED TABLE: PrescriptionItem (10+ records)
-- =============================================
INSERT INTO PrescriptionItem (PrescriptionID, MedicineID, Quantity, Dosage, Frequency, Duration, Note) VALUES 
(1, 1, 10, N'1 viên', N'Sáng - Chiều', N'5 ngày', N'Uống sau ăn'),
(1, 3, 20, N'2 viên', N'Sáng - Tối', N'10 ngày', N'Uống nhiều nước'),
(2, 7, 30, N'1 viên', N'Sáng', N'30 ngày', N'Uống đúng giờ'),
(3, 5, 14, N'1 viên', N'Sáng - Tối', N'7 ngày', N'Uống trước ăn 30p'),
(4, 3, 10, N'1 viên', N'Sáng', N'10 ngày', NULL),
(5, 4, 20, N'1 viên', N'Khi đau', N'5 ngày', N'Không uống lúc đói'),
(6, 1, 15, N'1 viên', N'Sáng - Trưa - Tối', N'5 ngày', N'Hạ sốt'),
(7, 7, 60, N'1 viên', N'Sáng', N'2 tháng', N'Tái khám khi hết thuốc'),
(8, 2, 21, N'1 viên', N'Sáng - Chiều - Tối', N'7 ngày', N'Kháng sinh'),
(9, 10, 10, N'1 viên', N'Khi đau', N'3 ngày', N'Giảm đau sau mổ'),
(10, 6, 30, N'1 viên', N'Sáng', N'30 ngày', N'Bổ não');

-- =============================================
-- 11. SEED TABLE: ConsultationRequests (10+ records)
-- =============================================
INSERT INTO ConsultationRequests (PatientID, DoctorID, Specialty, Priority, Symptoms, CreatedDate, Status) VALUES 
(1, NULL, N'Tim mạch', N'Khẩn cấp', N'Đau ngực dữ dội, khó thở.', GETDATE(), N'Chờ phản hồi'),
(1, NULL, N'Da liễu', N'Trung bình', N'Nổi mẩn đỏ, ngứa.', DATEADD(HOUR, -4, GETDATE()), N'Chờ phản hồi'),
(1, 2, N'Nội khoa', N'Thấp', N'Đau đầu nhẹ, mệt mỏi.', DATEADD(DAY, -1, GETDATE()), N'Đã phản hồi'),
(3, NULL, N'Tiêu hóa', N'Cao', N'Đau bụng quặn từng cơn.', GETDATE(), N'Chờ phản hồi'),
(5, 6, N'Cơ xương khớp', N'Thấp', N'Mỏi gối khi leo cầu thang.', DATEADD(DAY, -2, GETDATE()), N'Đã phản hồi'),
(7, 4, N'Tim mạch', N'Cao', N'Huyết áp tăng đột ngột.', DATEADD(HOUR, -1, GETDATE()), N'Đang xử lý'),
(2, NULL, N'Nội tiết', N'Trung bình', N'Đường huyết không ổn định.', GETDATE(), N'Chờ phản hồi'),
(9, NULL, N'Ngoại khoa', N'Thấp', N'Kiểm tra vết mổ cũ.', DATEADD(DAY, -3, GETDATE()), N'Đã hủy'),
(6, NULL, N'Truyền nhiễm', N'Cao', N'Sốt cao không hạ.', GETDATE(), N'Chờ phản hồi'),
(10, 5, N'Thần kinh', N'Trung bình', N'Mất ngủ kéo dài.', DATEADD(DAY, -5, GETDATE()), N'Đã phản hồi');

-- =============================================
-- 12. SEED TABLE: DoctorInstruction (10+ records)
-- =============================================
INSERT INTO DoctorInstruction (DoctorID, PatientID, Instruction, NurseNote, Status) VALUES
(2, 1, N'Theo dõi nhiệt độ 4h/lần', N'Nhiệt độ ổn định 37 độ', 'Pending'),
(2, 1, N'Cho uống thuốc hạ sốt nếu sốt > 38.5', N'Đã thực hiện lúc 10h', 'Completed'),
(4, 3, N'Theo dõi đau bụng', N'Bệnh nhân bớt đau', 'Pending'),
(4, 7, N'Đo huyết áp mỗi 2h', N'HA 140/90', 'In Progress'),
(6, 5, N'Chườm đá vùng khớp sưng', N'Đã chườm 15p', 'Completed'),
(5, 10, N'Theo dõi giấc ngủ', N'Bệnh nhân ngủ được 4 tiếng', 'Pending'),
(2, 2, N'Thử đường huyết mao mạch', N'Đường huyết 7.5 mmol/L', 'Completed'),
(6, 9, N'Thay băng vết thương', N'Vết thương khô', 'Completed'),
(2, 6, N'Khuyến khích uống nhiều nước', N'Bệnh nhân đã uống 1L', 'Pending'),
(4, 4, N'Khí dung Ventolin', N'Đã thực hiện', 'Completed');

-- =============================================
-- 13. SEED TABLE: NursingInstructions (10+ records)
-- =============================================
INSERT INTO NursingInstructions (PatientID, DoctorID, NurseID, InstructionType, Priority, Content) VALUES
(1, 2, 3, N'Chăm sóc cấp I', N'Cao', N'Theo dõi sinh hiệu liên tục'),
(2, 2, 3, N'Vệ sinh', N'Thấp', N'Hỗ trợ bệnh nhân tắm gội'),
(3, 4, 7, N'Dùng thuốc', N'Trung bình', N'Tiêm thuốc giảm đau'),
(4, 5, 8, N'Giáo dục sức khỏe', N'Thấp', N'Hướng dẫn cách dùng bình xịt hen'),
(5, 6, 9, N'Vận động', N'Trung bình', N'Hỗ trợ đi lại bằng nạng'),
(6, 2, 7, N'Dinh dưỡng', N'Trung bình', N'Chế độ ăn mềm, dễ tiêu'),
(7, 4, 8, N'Theo dõi', N'Cao', N'Báo bác sĩ ngay nếu HA > 180'),
(8, 2, 9, N'Vệ sinh', N'Thấp', N'Rửa mũi xoang'),
(9, 6, 3, N'Vết thương', N'Trung bình', N'Cắt chỉ vết mổ'),
(10, 5, 7, N'Tâm lý', N'Thấp', N'Trò chuyện động viên bệnh nhân');

-- =============================================
-- 14. SEED TABLE: PatientRequest (10+ records)
-- =============================================
INSERT INTO PatientRequest (PatientID, NurseID, Content, Status) VALUES
(1, 3, N'Xin thêm nước uống', 'Completed'),
(1, 3, N'Đau đầu quá cần gặp bác sĩ', 'Pending'),
(2, 3, N'Điều hòa lạnh quá', 'Completed'),
(3, 7, N'Xin đổi chăn mới', 'Pending'),
(4, 8, N'Hỏi giờ uống thuốc', 'Completed'),
(5, 9, N'Nhà vệ sinh hết giấy', 'Processing'),
(6, 7, N'Xin về sớm', 'Rejected'),
(7, 8, N'Máy đo huyết áp kêu tít tít', 'Completed'),
(8, 9, N'Xin thực đơn chay', 'Pending'),
(9, 3, N'Đau vết mổ', 'Forwarded');

-- =============================================
-- 15. SEED TABLE: EquipmentRequest (10+ records)
-- =============================================
INSERT INTO EquipmentRequest (StaffID, EquipmentID, PatientID, Quantity, Reason, Status, Urgency) VALUES
(3, 2, 7, 1, N'Bệnh nhân cần di chuyển đi chụp X-Quang', 'Approved', 'High'),
(3, 6, 1, 1, N'Nhiệt kế cũ bị hỏng', 'Approved', 'Medium'),
(7, 5, 3, 1, N'Giường hỏng tay quay', 'Pending', 'Low'),
(8, 4, 2, 1, N'Máy đo đường huyết hết pin', 'Completed', 'Medium'),
(9, 10, NULL, 1, N'Mượn máy siêu âm tại giường', 'Pending', 'High'),
(2, 1, 7, 1, N'Cần máy đo HA cơ', 'Approved', 'Medium'),
(4, 3, 4, 1, N'Cần máy trợ thở hỗ trợ', 'Pending', 'High'),
(3, 2, 5, 1, N'Bệnh nhân xuất viện ra xe', 'Completed', 'Low'),
(7, 6, NULL, 5, N'Bổ sung nhiệt kế cho khoa', 'Pending', 'Low'),
(5, 8, NULL, 1, N'Đèn mổ phòng tiểu phẫu bị tối', 'Processing', 'High');

GO