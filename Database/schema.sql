-- Tạo Database
CREATE DATABASE HospitalManagement;
GO
USE HospitalManagement;
GO

-- 1. Bảng Staff (Gộp chung Doctor, Nurse, Admin)
CREATE TABLE Staff (
    StaffID INT PRIMARY KEY IDENTITY(1,1),
    FullName NVARCHAR(100) NOT NULL,
    DoB DATE,
    Phone VARCHAR(15),
    Email VARCHAR(100) UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL, 
    Role NVARCHAR(20) NOT NULL CHECK (Role IN ('Doctor', 'Nurse', 'Admin')), -- Phân quyền
    Specialization NVARCHAR(100), -- Chỉ dành cho Doctor [cite: 1]
    AdminPrivilege BIT DEFAULT 0  -- Chỉ dành cho Admin [cite: 6]
);

-- 2. Bảng Patient (Bệnh nhân)
CREATE TABLE Patient (
    PatientID INT PRIMARY KEY IDENTITY(1,1),
    FullName NVARCHAR(100) NOT NULL,
    Gender NVARCHAR(10),
    DoB DATE,
    Phone VARCHAR(15),
    Email VARCHAR(100), 
    Address NVARCHAR(200),
    PasswordHash VARCHAR(255) NOT NULL
);

-- 3. Bảng Medicine (Thuốc)
CREATE TABLE Medicine (
    MedicineID INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100) NOT NULL,
    UnitPrice DECIMAL(10, 2),
    StockQuantity INT DEFAULT 0, -- Quản lý tồn kho 
    ExpiryDate DATE
);

-- 4. Bảng MedicalRecord (Hồ sơ bệnh án)
CREATE TABLE MedicalRecord (
    RecordID INT PRIMARY KEY IDENTITY(1,1),
    PatientID INT FOREIGN KEY REFERENCES Patient(PatientID),
    DoctorID INT FOREIGN KEY REFERENCES Staff(StaffID), -- Bác sĩ phụ trách
    Diagnosis NVARCHAR(MAX), -- Chẩn đoán
    Notes NVARCHAR(MAX),     -- Ghi chú
    Date DATETIME DEFAULT GETDATE()
);

-- 5. Bảng Prescription (Đơn thuốc - Phần đầu)
CREATE TABLE Prescription (
    PrescriptionID INT PRIMARY KEY IDENTITY(1,1),
    RecordID INT FOREIGN KEY REFERENCES MedicalRecord(RecordID),
    CreatedDate DATETIME DEFAULT GETDATE()
);

-- 6. Bảng PrescriptionItem (Chi tiết đơn thuốc)
CREATE TABLE PrescriptionItem (
    ItemID INT PRIMARY KEY IDENTITY(1,1),
    PrescriptionID INT FOREIGN KEY REFERENCES Prescription(PrescriptionID),
    MedicineID INT FOREIGN KEY REFERENCES Medicine(MedicineID),
    Quantity INT,
    Dosage NVARCHAR(100),    -- Liều lượng (VD: 2 viên/ngày)
    Frequency NVARCHAR(100), -- Tần suất
    Duration NVARCHAR(50),   -- Thời gian dùng
    Note NVARCHAR(200)
);

-- 7. Bảng Appointment (Lịch hẹn)
CREATE TABLE Appointment (
    AppointmentID INT PRIMARY KEY IDENTITY(1,1),
    PatientID INT FOREIGN KEY REFERENCES Patient(PatientID),
    DoctorID INT FOREIGN KEY REFERENCES Staff(StaffID),
    AppointmentDate DATETIME NOT NULL,
    Status NVARCHAR(20) DEFAULT 'Pending' CHECK (Status IN ('Pending', 'Confirmed', 'Completed', 'Cancelled')),
    Reason NVARCHAR(200)
);

-- 8. Bảng Equipment (Thiết bị y tế)
CREATE TABLE Equipment (
    EquipmentID INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100) NOT NULL,
    Status NVARCHAR(50), -- Tình trạng (Tốt/Hỏng)
    Info NVARCHAR(MAX),
    Quantity INT DEFAULT 0
);

-- 9. Bảng EquipmentRequest (Yêu cầu thiết bị - Của Y tá/Bác sĩ)
CREATE TABLE EquipmentRequest (
    RequestID INT PRIMARY KEY IDENTITY(1,1),
    StaffID INT FOREIGN KEY REFERENCES Staff(StaffID), -- Người yêu cầu
    EquipmentID INT FOREIGN KEY REFERENCES Equipment(EquipmentID),
    Quantity INT,
    RequestDate DATETIME DEFAULT GETDATE(),
    Status NVARCHAR(20) DEFAULT 'Pending' -- Pending/Approved/Rejected
);

-- 10. Bảng Schedule (Lịch làm việc nhân viên)
CREATE TABLE Schedule (
    ScheduleID INT PRIMARY KEY IDENTITY(1,1),
    StaffID INT FOREIGN KEY REFERENCES Staff(StaffID),
    Room NVARCHAR(50),
    WorkDate DATE,
    StartTime TIME,
    EndTime TIME
);

-- Thêm thuộc tính cho bảng Patient

ALTER TABLE Patient ADD 
    InsuranceID VARCHAR(50),      -- Mã BHYT
    BloodGroup NVARCHAR(5),       -- Nhóm máu
    Allergies NVARCHAR(MAX),      -- Dị ứng thuốc
    MedicalHistory NVARCHAR(MAX), -- Tiền sử bệnh
    CurrentRoom NVARCHAR(20),     -- Phòng bệnh 
    AdmissionDiagnosis NVARCHAR(MAX), -- Chẩn đoán nhập viện
    CurrentCondition NVARCHAR(MAX);   -- Tình trạng hiện tại

-- 11.
CREATE TABLE NursingInstructions (
    InstructionID INT PRIMARY KEY IDENTITY(1,1), -- Sửa lỗi AUTO_INCREMENT
    PatientID INT NOT NULL,
    DoctorID INT NOT NULL,
    NurseID INT DEFAULT NULL,
    InstructionType NVARCHAR(100), -- Dùng NVARCHAR để hỗ trợ tiếng Việt có dấu
    Priority NVARCHAR(50),
    Content NVARCHAR(MAX),
    Status NVARCHAR(50) DEFAULT N'Chờ xử lý',
    CreatedAt DATETIME DEFAULT GETDATE() -- GETDATE() tương đương CURRENT_TIMESTAMP
);

-- 12.
CREATE TABLE ConsultationRequests (
    RequestID INT PRIMARY KEY IDENTITY(1,1),
    PatientID INT NOT NULL,
    DoctorID INT NULL, -- Để NULL vì lúc đầu chưa có bác sĩ nào nhận
    Specialty NVARCHAR(100), -- Chuyên khoa (Tim mạch, Da liễu...)
    Priority NVARCHAR(50), -- Mức độ: Khẩn cấp, Trung bình, Thấp
    Symptoms NVARCHAR(MAX), -- Triệu chứng/Mô tả bệnh
    ResponseContent NVARCHAR(MAX) NULL, -- Nội dung phản hồi của bác sĩ
    Status NVARCHAR(50) DEFAULT N'Chờ phản hồi', -- 'Chờ phản hồi' hoặc 'Đã phản hồi'
    CreatedDate DATETIME DEFAULT GETDATE(), -- Thời gian gửi yêu cầu
    ResponseDate DATETIME NULL, -- Thời gian bác sĩ trả lời
    
    -- Tạo khóa ngoại
    CONSTRAINT FK_Consult_Patient FOREIGN KEY (PatientID) REFERENCES Patient(PatientID),
    CONSTRAINT FK_Consult_Doctor FOREIGN KEY (DoctorID) REFERENCES Staff(StaffID)
);

ALTER TABLE Patient
ADD RelativeName NVARCHAR(255),
    RelativePhone VARCHAR(15),
    Relationship NVARCHAR(100);

GO
