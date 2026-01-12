USE [master]
GO

-- Xóa DB cũ nếu tồn tại để tránh lỗi conflict khi chạy lại
IF EXISTS (SELECT name FROM sys.databases WHERE name = N'HospitalManagement')
BEGIN
    ALTER DATABASE [HospitalManagement] SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE [HospitalManagement];
END
GO

CREATE DATABASE [HospitalManagement]
GO

USE [HospitalManagement]
GO

-- =============================================
-- 1. BẢNG USERS (Quản lý đăng nhập chung)
-- =============================================
CREATE TABLE [dbo].[Users](
    [UserID] INT IDENTITY(1,1) PRIMARY KEY,
    [Username] VARCHAR(50) UNIQUE NOT NULL,
    [PasswordHash] VARCHAR(255) NOT NULL, -- Mật khẩu giả định
    [Email] VARCHAR(100) UNIQUE,
    [Role] NVARCHAR(20) CHECK ([Role] IN ('Admin','Doctor','Nurse','Patient')),
    [CreatedAt] DATETIME DEFAULT GETDATE()
);
GO

-- =============================================
-- 2. BẢNG STAFF (Nhân viên: Bác sĩ, Y tá, Admin)
-- =============================================
CREATE TABLE [dbo].[Staff](
    [StaffID] INT IDENTITY(1,1) PRIMARY KEY,
    [UserID] INT UNIQUE REFERENCES [Users](UserID), -- Liên kết 1-1 với Users
    [FullName] NVARCHAR(100) NOT NULL,
    [DoB] DATE,
    [Phone] VARCHAR(15),
    [Specialization] NVARCHAR(100), -- Ví dụ: Tim mạch, Nhi (chỉ dùng cho Doctor)
    [Department] NVARCHAR(100)      -- Khoa làm việc
);
GO

-- =============================================
-- 3. BẢNG PATIENTS (Bệnh nhân)
-- =============================================
CREATE TABLE [dbo].[Patients](
    [PatientID] INT IDENTITY(1,1) PRIMARY KEY,
    [UserID] INT UNIQUE REFERENCES [Users](UserID), -- Liên kết 1-1 với Users
    [FullName] NVARCHAR(100) NOT NULL,
    [Gender] NVARCHAR(10) CHECK ([Gender] IN ('Male', 'Female', 'Other')),
    [DoB] DATE,
    [Phone] VARCHAR(15),
    [Address] NVARCHAR(200),
    [InsuranceID] VARCHAR(50),
    [BloodGroup] VARCHAR(5),
    [Allergies] NVARCHAR(MAX)
);
GO

-- =============================================
-- 4. BẢNG APPOINTMENTS (Lịch hẹn khám)
-- Quan trọng: Tách Date, StartTime, EndTime để khớp logic check trùng
-- =============================================
CREATE TABLE [dbo].[Appointments](
    [AppointmentID] INT IDENTITY(1,1) PRIMARY KEY,
    [PatientID] INT REFERENCES [Patients](PatientID),
    [DoctorID] INT REFERENCES [Staff](StaffID),
    [Date] DATE NOT NULL,
    [StartTime] TIME(0) NOT NULL, -- TIME(0) để bỏ phần mili giây
    [EndTime] TIME(0) NOT NULL,
    [Status] NVARCHAR(20) DEFAULT 'Pending' 
        CHECK ([Status] IN ('Pending', 'Confirmed', 'Completed', 'Cancelled')),
    [Notes] NVARCHAR(MAX),
    [CreatedAt] DATETIME DEFAULT GETDATE()
);
GO

-- =============================================
-- 5. BẢNG MEDICINES (Kho thuốc)
-- =============================================
CREATE TABLE [dbo].[Medicines](
    [MedicineID] INT IDENTITY(1,1) PRIMARY KEY,
    [Name] NVARCHAR(100) NOT NULL,
    [Description] NVARCHAR(MAX),
    [Unit] NVARCHAR(20), -- Viên, Chai, Vỉ
    [UnitPrice] DECIMAL(18,2),
    [StockQuantity] INT DEFAULT 0,
    [ExpiryDate] DATE
);
GO

-- =============================================
-- 6. BẢNG MEDICAL_RECORDS (Hồ sơ bệnh án)
-- =============================================
CREATE TABLE [dbo].[MedicalRecords](
    [RecordID] INT IDENTITY(1,1) PRIMARY KEY,
    [PatientID] INT REFERENCES [Patients](PatientID),
    [DoctorID] INT REFERENCES [Staff](StaffID),
    [Date] DATETIME DEFAULT GETDATE(),
    [Diagnosis] NVARCHAR(MAX), -- Chẩn đoán
    [TreatmentPlan] NVARCHAR(MAX), -- Phác đồ điều trị
    [Notes] NVARCHAR(MAX)
);
GO

-- =============================================
-- 7. BẢNG PRESCRIPTIONS (Đơn thuốc - Header)
-- =============================================
CREATE TABLE [dbo].[Prescriptions](
    [PrescriptionID] INT IDENTITY(1,1) PRIMARY KEY,
    [RecordID] INT REFERENCES [MedicalRecords](RecordID),
    [Date] DATETIME DEFAULT GETDATE(),
    [DoctorNote] NVARCHAR(MAX),
    [TotalAmount] DECIMAL(18,2) DEFAULT 0
);
GO

-- =============================================
-- 8. BẢNG PRESCRIPTION_ITEMS (Chi tiết đơn thuốc)
-- =============================================
CREATE TABLE [dbo].[PrescriptionItems](
    [ItemID] INT IDENTITY(1,1) PRIMARY KEY,
    [PrescriptionID] INT REFERENCES [Prescriptions](PrescriptionID),
    [MedicineID] INT REFERENCES [Medicines](MedicineID),
    [Quantity] INT NOT NULL,
    [Dosage] NVARCHAR(200), -- Liều dùng: Sáng 1 viên, Chiều 1 viên
    [PriceAtTime] DECIMAL(18,2) -- Giá tại thời điểm kê đơn
);
GO

-- =============================================
-- 9. BẢNG DOCTOR_INSTRUCTIONS (Y lệnh / Chỉ thị)
-- =============================================
CREATE TABLE [dbo].[DoctorInstructions](
    [InstructionID] INT IDENTITY(1,1) PRIMARY KEY,
    [DoctorID] INT REFERENCES [Staff](StaffID),
    [PatientID] INT REFERENCES [Patients](PatientID),
    [Content] NVARCHAR(MAX) NOT NULL,
    [Status] NVARCHAR(20) DEFAULT 'Pending' CHECK ([Status] IN ('Pending', 'Completed')),
    [CreatedAt] DATETIME DEFAULT GETDATE(),
    [CompletedAt] DATETIME
);
GO

-- =============================================
-- 10. BẢNG CONSULTATION_REQUESTS (Tư vấn trực tuyến)
-- =============================================
CREATE TABLE [dbo].[ConsultationRequests](
    [RequestID] INT IDENTITY(1,1) PRIMARY KEY,
    [PatientID] INT REFERENCES [Patients](PatientID),
    [DoctorID] INT REFERENCES [Staff](StaffID), -- Bác sĩ trả lời (Null khi chưa ai trả lời)
    [Title] NVARCHAR(200),
    [Question] NVARCHAR(MAX),
    [Response] NVARCHAR(MAX),
    [Status] NVARCHAR(20) DEFAULT 'Pending' CHECK ([Status] IN ('Pending', 'Replied')),
    [CreatedAt] DATETIME DEFAULT GETDATE(),
    [RepliedAt] DATETIME
);
GO

-- =============================================
-- 11. BẢNG PATIENT_REQUESTS (Yêu cầu hỗ trợ tại phòng)
-- =============================================
CREATE TABLE [dbo].[PatientRequests](
    [RequestID] INT IDENTITY(1,1) PRIMARY KEY,
    [PatientID] INT REFERENCES [Patients](PatientID),
    [NurseID] INT REFERENCES [Staff](StaffID), -- Y tá xử lý
    [Content] NVARCHAR(MAX), -- Ví dụ: "Xin thêm chăn", "Đau vết mổ"
    [Status] NVARCHAR(20) DEFAULT 'Pending' CHECK ([Status] IN ('Pending', 'Processing', 'Completed')),
    [CreatedAt] DATETIME DEFAULT GETDATE()
);
GO

-- =============================================
-- 12. BẢNG EQUIPMENTS (Danh mục thiết bị)
-- =============================================
CREATE TABLE [dbo].[Equipments](
    [EquipmentID] INT IDENTITY(1,1) PRIMARY KEY,
    [Name] NVARCHAR(100) NOT NULL,
    [TotalQuantity] INT DEFAULT 0,
    [AvailableQuantity] INT DEFAULT 0,
    [Description] NVARCHAR(MAX)
);
GO

-- =============================================
-- 13. BẢNG EQUIPMENT_REQUESTS (Yêu cầu mượn thiết bị)
-- =============================================
CREATE TABLE [dbo].[EquipmentRequests](
    [RequestID] INT IDENTITY(1,1) PRIMARY KEY,
    [NurseID] INT REFERENCES [Staff](StaffID),
    [EquipmentID] INT REFERENCES [Equipments](EquipmentID),
    [Quantity] INT NOT NULL,
    [Reason] NVARCHAR(MAX),
    [Status] NVARCHAR(20) DEFAULT 'Pending' CHECK ([Status] IN ('Pending', 'Approved', 'Rejected')),
    [CreatedAt] DATETIME DEFAULT GETDATE()
);
GO

-- =============================================
-- 14. BẢNG BILLS (Hóa đơn - Optional nhưng nên có)
-- =============================================
CREATE TABLE [dbo].[Bills](
    [BillID] INT IDENTITY(1,1) PRIMARY KEY,
    [PatientID] INT REFERENCES [Patients](PatientID),
    [PrescriptionID] INT REFERENCES [Prescriptions](PrescriptionID), -- Link nếu thanh toán thuốc
    [AppointmentID] INT REFERENCES [Appointments](AppointmentID), -- Link nếu thanh toán phí khám
    [TotalAmount] DECIMAL(18,2),
    [Status] NVARCHAR(20) DEFAULT 'Unpaid' CHECK ([Status] IN ('Unpaid', 'Paid')),
    [PaymentMethod] NVARCHAR(50), -- Cash, Banking, Insurance
    [CreatedAt] DATETIME DEFAULT GETDATE()
);
GO