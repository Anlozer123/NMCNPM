USE [master]
GO

-- 1. TẠO DATABASE
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'HospitalManagement')
BEGIN
    CREATE DATABASE [HospitalManagement]
END
GO

USE [HospitalManagement]
GO

-- =========================
-- 2. TABLE DEFINITIONS
-- =========================

-- Staff
CREATE TABLE [dbo].[Staff](
    [StaffID] INT IDENTITY(1,1) PRIMARY KEY,
    [FullName] NVARCHAR(100) NOT NULL,
    [DoB] DATE NULL,
    [Phone] VARCHAR(15) NULL,
    [Email] VARCHAR(100) UNIQUE,
    [PasswordHash] VARCHAR(255) NOT NULL,
    [Role] NVARCHAR(20) NOT NULL CHECK ([Role] IN ('Admin','Nurse','Doctor')),
    [Specialization] NVARCHAR(100) NULL,
    [AdminPrivilege] BIT DEFAULT 0
);
GO

-- Patient
CREATE TABLE [dbo].[Patient](
    [PatientID] INT IDENTITY(1,1) PRIMARY KEY,
    [FullName] NVARCHAR(100) NOT NULL,
    [Gender] NVARCHAR(10),
    [DoB] DATE,
    [Phone] VARCHAR(15),
    [Email] VARCHAR(100),
    [Address] NVARCHAR(200),
    [PasswordHash] VARCHAR(255) NOT NULL,
    [CurrentRoom] NVARCHAR(20),
    [NurseID] INT NULL
);
GO

-- Medicine
CREATE TABLE [dbo].[Medicine](
    [MedicineID] INT IDENTITY(1,1) PRIMARY KEY,
    [Name] NVARCHAR(100) NOT NULL,
    [UnitPrice] DECIMAL(10,2),
    [StockQuantity] INT DEFAULT 0,
    [ExpiryDate] DATE
);
GO

-- Equipment
CREATE TABLE [dbo].[Equipment](
    [EquipmentID] INT IDENTITY(1,1) PRIMARY KEY,
    [Name] NVARCHAR(100) NOT NULL,
    [Status] NVARCHAR(50),
    [Info] NVARCHAR(MAX),
    [Quantity] INT DEFAULT 0
);
GO

-- Appointment
CREATE TABLE [dbo].[Appointment](
    [AppointmentID] INT IDENTITY(1,1) PRIMARY KEY,
    [PatientID] INT,
    [DoctorID] INT,
    [AppointmentDate] DATETIME NOT NULL,
    [Reason] NVARCHAR(200),
    [Status] NVARCHAR(20) DEFAULT 'Pending'
        CHECK ([Status] IN ('Cancelled','Completed','Confirmed','Pending'))
);
GO

-- MedicalRecord
CREATE TABLE [dbo].[MedicalRecord](
    [RecordID] INT IDENTITY(1,1) PRIMARY KEY,
    [PatientID] INT,
    [DoctorID] INT,
    [Diagnosis] NVARCHAR(MAX),
    [Notes] NVARCHAR(MAX),
    [Date] DATETIME DEFAULT GETDATE()
);
GO

-- Prescription (Header)
CREATE TABLE [dbo].[Prescription](
    [PrescriptionID] INT IDENTITY(1,1) PRIMARY KEY,
    [RecordID] INT,
    [CreatedDate] DATETIME DEFAULT GETDATE()
);
GO

-- PrescriptionItem
CREATE TABLE [dbo].[PrescriptionItem](
    [ItemID] INT IDENTITY(1,1) PRIMARY KEY,
    [PrescriptionID] INT,
    [MedicineID] INT,
    [Quantity] INT,
    [Dosage] NVARCHAR(100),
    [Frequency] NVARCHAR(100),
    [Duration] NVARCHAR(50),
    [Note] NVARCHAR(200)
);
GO

-- DoctorInstruction
CREATE TABLE [dbo].[DoctorInstruction](
    [InstructionID] INT IDENTITY(1,1) PRIMARY KEY,
    [DoctorID] INT,
    [PatientID] INT,
    [Instruction] NVARCHAR(MAX) NOT NULL,
    [NurseNote] NVARCHAR(MAX),
    [CreatedAt] DATETIME DEFAULT GETDATE(),
    [CompletedAt] DATETIME NULL,
    [Status] NVARCHAR(20) DEFAULT 'Pending'
        CHECK ([Status] IN ('Completed','Pending'))
);
GO

-- NursingInstructions
CREATE TABLE [dbo].[NursingInstructions](
    [InstructionID] INT IDENTITY(1,1) PRIMARY KEY,
    [PatientID] INT NOT NULL,
    [DoctorID] INT NOT NULL,
    [NurseID] INT NULL,
    [InstructionType] NVARCHAR(100),
    [Priority] NVARCHAR(50),
    [Content] NVARCHAR(MAX),
    [Status] NVARCHAR(50) DEFAULT N'Chờ xử lý',
    [CreatedAt] DATETIME DEFAULT GETDATE()
);
GO

-- ConsultationRequests
CREATE TABLE [dbo].[ConsultationRequests](
    [RequestID] INT IDENTITY(1,1) PRIMARY KEY,
    [PatientID] INT NOT NULL,
    [DoctorID] INT NULL,
    [Specialty] NVARCHAR(100),
    [Priority] NVARCHAR(50),
    [Symptoms] NVARCHAR(MAX),
    [ResponseContent] NVARCHAR(MAX),
    [Status] NVARCHAR(50) DEFAULT N'Chờ phản hồi',
    [CreatedDate] DATETIME DEFAULT GETDATE(),
    [ResponseDate] DATETIME NULL
);
GO

-- PatientRequest
CREATE TABLE [dbo].[PatientRequest](
    [RequestID] INT IDENTITY(1,1) PRIMARY KEY,
    [PatientID] INT,
    [NurseID] INT,
    [Content] NVARCHAR(MAX) NOT NULL,
    [CreatedAt] DATETIME DEFAULT GETDATE(),
    [UpdatedAt] DATETIME NULL,
    [Status] NVARCHAR(20) DEFAULT 'Pending'
        CHECK ([Status] IN ('Escalated','Completed','Processing','Pending'))
);
GO

-- EquipmentRequest
CREATE TABLE [dbo].[EquipmentRequest](
    [RequestID] INT IDENTITY(1,1) PRIMARY KEY,
    [StaffID] INT,
    [EquipmentID] INT,
    [Quantity] INT,
    [RequestDate] DATETIME DEFAULT GETDATE(),
    [Reason] NVARCHAR(200),
    [PatientID] INT,
    [Status] NVARCHAR(20) DEFAULT 'Pending',
    [Urgency] NVARCHAR(20) DEFAULT 'Normal'
        CHECK ([Urgency] IN ('Critical','High','Normal','Low'))
);
GO

-- Schedule
CREATE TABLE [dbo].[Schedule](
    [ScheduleID] INT IDENTITY(1,1) PRIMARY KEY,
    [StaffID] INT,
    [Room] NVARCHAR(50),
    [WorkDate] DATE,
    [StartTime] TIME,
    [EndTime] TIME
);
GO

-- WorkSchedule
CREATE TABLE [dbo].[WorkSchedule](
    [ScheduleID] INT IDENTITY(1,1) PRIMARY KEY,
    [StaffID] INT,
    [WorkDate] DATE NOT NULL,
    [Note] NVARCHAR(100),
    [ShiftType] NVARCHAR(20)
        CHECK ([ShiftType] IN ('Weekend','Night','Afternoon','Morning'))
);
GO

-- =========================
-- 3. EXTEND PATIENT
-- =========================
ALTER TABLE Patient ADD
    InsuranceID VARCHAR(50),
    BloodGroup NVARCHAR(5),
    Allergies NVARCHAR(MAX),
    MedicalHistory NVARCHAR(MAX),
    AdmissionDiagnosis NVARCHAR(MAX),
    CurrentCondition NVARCHAR(MAX),
    RelativeName NVARCHAR(255),
    RelativePhone VARCHAR(15),
    Relationship NVARCHAR(100);
GO

-- =========================
-- 4. FOREIGN KEYS
-- =========================
ALTER TABLE Patient ADD FOREIGN KEY (NurseID) REFERENCES Staff(StaffID);

ALTER TABLE Appointment ADD FOREIGN KEY (DoctorID) REFERENCES Staff(StaffID);
ALTER TABLE Appointment ADD FOREIGN KEY (PatientID) REFERENCES Patient(PatientID);

ALTER TABLE MedicalRecord ADD FOREIGN KEY (DoctorID) REFERENCES Staff(StaffID);
ALTER TABLE MedicalRecord ADD FOREIGN KEY (PatientID) REFERENCES Patient(PatientID);

ALTER TABLE Prescription ADD FOREIGN KEY (RecordID) REFERENCES MedicalRecord(RecordID);

ALTER TABLE PrescriptionItem ADD FOREIGN KEY (PrescriptionID) REFERENCES Prescription(PrescriptionID);
ALTER TABLE PrescriptionItem ADD FOREIGN KEY (MedicineID) REFERENCES Medicine(MedicineID);

ALTER TABLE DoctorInstruction ADD FOREIGN KEY (DoctorID) REFERENCES Staff(StaffID);
ALTER TABLE DoctorInstruction ADD FOREIGN KEY (PatientID) REFERENCES Patient(PatientID);

ALTER TABLE NursingInstructions ADD FOREIGN KEY (PatientID) REFERENCES Patient(PatientID);
ALTER TABLE NursingInstructions ADD FOREIGN KEY (DoctorID) REFERENCES Staff(StaffID);
ALTER TABLE NursingInstructions ADD FOREIGN KEY (NurseID) REFERENCES Staff(StaffID);

ALTER TABLE ConsultationRequests ADD FOREIGN KEY (PatientID) REFERENCES Patient(PatientID);
ALTER TABLE ConsultationRequests ADD FOREIGN KEY (DoctorID) REFERENCES Staff(StaffID);

ALTER TABLE PatientRequest ADD FOREIGN KEY (PatientID) REFERENCES Patient(PatientID);
ALTER TABLE PatientRequest ADD FOREIGN KEY (NurseID) REFERENCES Staff(StaffID);

ALTER TABLE EquipmentRequest ADD FOREIGN KEY (EquipmentID) REFERENCES Equipment(EquipmentID);
ALTER TABLE EquipmentRequest ADD FOREIGN KEY (PatientID) REFERENCES Patient(PatientID);
ALTER TABLE EquipmentRequest ADD FOREIGN KEY (StaffID) REFERENCES Staff(StaffID);

ALTER TABLE Schedule ADD FOREIGN KEY (StaffID) REFERENCES Staff(StaffID);
ALTER TABLE WorkSchedule ADD FOREIGN KEY (StaffID) REFERENCES Staff(StaffID);
GO
