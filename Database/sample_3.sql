USE HospitalManagement;
GO

-- --- THÊM DỮ LIỆU MẪU ĐỂ KHỚP VỚI GIAO DIỆN (Ảnh 1) ---
-- Lưu ý: Dữ liệu này giả định PatientID 1, 2, 3 đã tồn tại trong bảng Patient.
-- Nếu chưa có, bạn hãy thêm Patient trước hoặc sửa ID lại cho khớp.

INSERT INTO ConsultationRequests (PatientID, DoctorID, Specialty, Priority, Symptoms, CreatedDate, Status)
VALUES 
-- Yêu cầu 1: Khẩn cấp (Nguyễn Văn A)
(1, NULL, N'Tim mạch', N'Khẩn cấp', N'Đau ngực dữ dội, khó thở, vã mồ hôi. Triệu chứng xuất hiện khoảng 2 giờ trước.', GETDATE(), N'Chờ phản hồi'),

-- Yêu cầu 2: Trung bình (Trần Thị B)
(1, NULL, N'Da liễu', N'Trung bình', N'Nổi mẩn đỏ ở tay và chân, ngứa nhiều, kéo dài 3 ngày.', DATEADD(HOUR, -4, GETDATE()), N'Chờ phản hồi'),

-- Yêu cầu 3: Thấp (Lê Văn C) - Đã có phản hồi
(1, 2, N'Nội khoa', N'Thấp', N'Đau đầu nhẹ, mệt mỏi. Có thể do stress công việc.', DATEADD(DAY, -1, GETDATE()), N'Đã phản hồi');
GO