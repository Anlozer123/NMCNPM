-- Tạo Database
CREATE DATABASE HospitalManagement;
GO
USE HospitalManagement;
GO

-- 1. Bảng Staff (Gộp chung Doctor, Nurse, Admin)
-- Dựa trên Class Staff [cite: 8] và quan hệ thừa kế [cite: 12, 13]
CREATE TABLE Staff (
    StaffID INT PRIMARY KEY IDENTITY(1,1),
    FullName NVARCHAR(100) NOT NULL,
    DoB DATE,
    Phone VARCHAR(15),
    Email VARCHAR(100) UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL, -- Dùng để Login [cite: 8]
    Role NVARCHAR(20) NOT NULL CHECK (Role IN ('Doctor', 'Nurse', 'Admin')), -- Phân quyền
    Specialization NVARCHAR(100), -- Chỉ dành cho Doctor [cite: 1]
    AdminPrivilege BIT DEFAULT 0  -- Chỉ dành cho Admin [cite: 6]
);

-- 2. Bảng Patient (Bệnh nhân)
-- Dựa trên Class Patient 
CREATE TABLE Patient (
    PatientID INT PRIMARY KEY IDENTITY(1,1),
    FullName NVARCHAR(100) NOT NULL,
    Gender NVARCHAR(10),
    DoB DATE,
    Phone VARCHAR(15),
    Address NVARCHAR(200),
    PasswordHash VARCHAR(255) NOT NULL -- Dùng để Login 
);

-- 3. Bảng Medicine (Thuốc)
-- Dựa trên Class Medicine 
CREATE TABLE Medicine (
    MedicineID INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100) NOT NULL,
    UnitPrice DECIMAL(10, 2),
    StockQuantity INT DEFAULT 0, -- Quản lý tồn kho 
    ExpiryDate DATE
);

-- 4. Bảng MedicalRecord (Hồ sơ bệnh án)
-- Dựa trên Class MedicalRecord 
CREATE TABLE MedicalRecord (
    RecordID INT PRIMARY KEY IDENTITY(1,1),
    PatientID INT FOREIGN KEY REFERENCES Patient(PatientID),
    DoctorID INT FOREIGN KEY REFERENCES Staff(StaffID), -- Bác sĩ phụ trách
    Diagnosis NVARCHAR(MAX), -- Chẩn đoán
    Notes NVARCHAR(MAX),     -- Ghi chú
    Date DATETIME DEFAULT GETDATE()
);

-- 5. Bảng Prescription (Đơn thuốc - Phần đầu)
-- Dựa trên Class Prescription [cite: 10]
CREATE TABLE Prescription (
    PrescriptionID INT PRIMARY KEY IDENTITY(1,1),
    RecordID INT FOREIGN KEY REFERENCES MedicalRecord(RecordID),
    CreatedDate DATETIME DEFAULT GETDATE()
);

-- 6. Bảng PrescriptionItem (Chi tiết đơn thuốc)
-- Dựa trên Class PrescriptionItem [cite: 16]
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
-- Dựa trên Class Appointment 
CREATE TABLE Appointment (
    AppointmentID INT PRIMARY KEY IDENTITY(1,1),
    PatientID INT FOREIGN KEY REFERENCES Patient(PatientID),
    DoctorID INT FOREIGN KEY REFERENCES Staff(StaffID),
    AppointmentDate DATETIME NOT NULL,
    Status NVARCHAR(20) DEFAULT 'Pending' CHECK (Status IN ('Pending', 'Confirmed', 'Completed', 'Cancelled')),
    Reason NVARCHAR(200)
);

-- 8. Bảng Equipment (Thiết bị y tế)
-- Dựa trên Class Equipment [cite: 30]
CREATE TABLE Equipment (
    EquipmentID INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100) NOT NULL,
    Status NVARCHAR(50), -- Tình trạng (Tốt/Hỏng)
    Info NVARCHAR(MAX),
    Quantity INT DEFAULT 0
);

-- 9. Bảng EquipmentRequest (Yêu cầu thiết bị - Của Y tá/Bác sĩ)
-- Dựa trên Class EquipmentRequest [cite: 31]
CREATE TABLE EquipmentRequest (
    RequestID INT PRIMARY KEY IDENTITY(1,1),
    StaffID INT FOREIGN KEY REFERENCES Staff(StaffID), -- Người yêu cầu
    EquipmentID INT FOREIGN KEY REFERENCES Equipment(EquipmentID),
    Quantity INT,
    RequestDate DATETIME DEFAULT GETDATE(),
    Status NVARCHAR(20) DEFAULT 'Pending' -- Pending/Approved/Rejected
);

-- 10. Bảng Schedule (Lịch làm việc nhân viên)
-- Dựa trên Class Schedule [cite: 26]
CREATE TABLE Schedule (
    ScheduleID INT PRIMARY KEY IDENTITY(1,1),
    StaffID INT FOREIGN KEY REFERENCES Staff(StaffID),
    Room NVARCHAR(50),
    WorkDate DATE,
    StartTime TIME,
    EndTime TIME
);

