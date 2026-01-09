USE HospitalManagement;
GO

-- 1. Cập nhật dữ liệu cho Phạm Bệnh Nhân A
UPDATE Patient 
SET 
    InsuranceID = 'BHYT-001-A', 
    BloodGroup = 'O+', 
    Allergies = N'Không', 
    MedicalHistory = N'Tăng huyết áp nhẹ', 
    CurrentRoom = '301', 
    AdmissionDiagnosis = N'Viêm phổi nhẹ', 
    CurrentCondition = N'Ổn định',
    Address = N'123 Đường Lê Lợi, TP.HCM' -- Cập nhật lại địa chỉ đầy đủ
WHERE FullName = N'Phạm Bệnh Nhân A';

-- 2. Cập nhật dữ liệu cho Hoàng Bệnh Nhân B
UPDATE Patient 
SET 
    InsuranceID = 'BHYT-999-B', 
    BloodGroup = 'A-', 
    Allergies = N'Penicillin', 
    MedicalHistory = N'Tiểu đường type 2', 
    CurrentRoom = '301', 
    AdmissionDiagnosis = N'Suy nhược cơ thể', 
    CurrentCondition = N'Hồi phục tốt',
    Address = N'456 Đường Nguyễn Huệ, TP.HCM'
WHERE FullName = N'Hoàng Bệnh Nhân B';
GO

-- Kiểm tra lại kết quả
SELECT * FROM Patient;