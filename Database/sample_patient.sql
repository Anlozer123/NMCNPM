use HospitalManagement
INSERT INTO Patient (
    FullName, 
    Gender, 
    DoB, 
    Phone, 
    Email, 
    PasswordHash, -- Trường này bắt buộc (NOT NULL) trong script của bạn
    Height, 
    Weight, 
    BMI, 
    HeartRate, 
    BloodSugar, 
    SystolicBP, 
    DiastolicBP
)
VALUES (
    N'Phùng Thanh Độ', 
    N'Nam', 
    '1989-09-12', -- Chuyển từ 12/09/1989 sang định dạng YYYY-MM-DD
    '0123456879', 
    'soibeti@gmail.com', 
    '123456', -- Đây là mật khẩu mẫu (đã hash), bạn có thể thay đổi
    170, 
    72.0, 
    24.9, 
    98, 
    80, 
    102, 
    72
);