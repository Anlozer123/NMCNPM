USE [master]
GO

-- 1. TẠO DATABASE (Nếu chưa tồn tại)
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'HospitalManagement')
BEGIN
    CREATE DATABASE [HospitalManagement]
END
GO

USE [HospitalManagement]
GO

-- 2. TẠO CÁC BẢNG (TABLES)

-- Bảng Staff (Nhân viên)
CREATE TABLE [dbo].[Staff](
    [StaffID] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [FullName] [nvarchar](100) NOT NULL,
    [DoB] [date] NULL,
    [Phone] [varchar](15) NULL,
    [Email] [varchar](100) NULL UNIQUE,
    [PasswordHash] [varchar](255) NOT NULL,
    [Role] [nvarchar](20) NOT NULL CHECK ([Role] IN ('Admin', 'Nurse', 'Doctor')),
    [Specialization] [nvarchar](100) NULL,
    [AdminPrivilege] [bit] DEFAULT 0
);
GO

-- Bảng Patient (Bệnh nhân)
CREATE TABLE [dbo].[Patient](
    [PatientID] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [FullName] [nvarchar](100) NOT NULL,
    [Gender] [nvarchar](10) NULL,
    [DoB] [date] NULL,
    [Phone] [varchar](15) NULL,
    [Email] [varchar](100) NULL,
    [Address] [nvarchar](200) NULL,
    [PasswordHash] [varchar](255) NOT NULL,
    [CurrentRoom] [nvarchar](20) NULL,
    [NurseID] [int] NULL -- FK liên kết sau
);
GO

-- Bảng Medicine (Thuốc)
CREATE TABLE [dbo].[Medicine](
    [MedicineID] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [Name] [nvarchar](100) NOT NULL,
    [UnitPrice] [decimal](10, 2) NULL,
    [StockQuantity] [int] DEFAULT 0,
    [ExpiryDate] [date] NULL
);
GO

-- Bảng Equipment (Thiết bị)
CREATE TABLE [dbo].[Equipment](
    [EquipmentID] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [Name] [nvarchar](100) NOT NULL,
    [Status] [nvarchar](50) NULL,
    [Info] [nvarchar](max) NULL,
    [Quantity] [int] DEFAULT 0
);
GO

-- Bảng Appointment (Lịch khám)
CREATE TABLE [dbo].[Appointment](
    [AppointmentID] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [PatientID] [int] NULL,
    [DoctorID] [int] NULL,
    [AppointmentDate] [datetime] NOT NULL,
    [Reason] [nvarchar](200) NULL,
    [Status] [nvarchar](20) DEFAULT 'Pending' CHECK ([Status] IN ('Cancelled', 'Completed', 'Confirmed', 'Pending'))
);
GO

-- Bảng MedicalRecord (Hồ sơ bệnh án)
CREATE TABLE [dbo].[MedicalRecord](
    [RecordID] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [PatientID] [int] NULL,
    [DoctorID] [int] NULL,
    [Diagnosis] [nvarchar](max) NULL,
    [Notes] [nvarchar](max) NULL,
    [Date] [datetime] DEFAULT GETDATE()
);
GO

-- Bảng Prescription (Đơn thuốc - Header)
CREATE TABLE [dbo].[Prescription](
    [PrescriptionID] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [RecordID] [int] NULL,
    [CreatedDate] [datetime] DEFAULT GETDATE()
);
GO

-- Bảng PrescriptionItem (Chi tiết đơn thuốc)
CREATE TABLE [dbo].[PrescriptionItem](
    [ItemID] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [PrescriptionID] [int] NULL,
    [MedicineID] [int] NULL,
    [Quantity] [int] NULL,
    [Dosage] [nvarchar](100) NULL,
    [Frequency] [nvarchar](100) NULL,
    [Duration] [nvarchar](50) NULL,
    [Note] [nvarchar](200) NULL
);
GO

-- Bảng DoctorInstruction (Y lệnh của bác sĩ)
CREATE TABLE [dbo].[DoctorInstruction](
    [InstructionID] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [DoctorID] [int] NULL,
    [PatientID] [int] NULL,
    [Instruction] [nvarchar](max) NOT NULL,
    [NurseNote] [nvarchar](max) NULL,
    [CreatedAt] [datetime] DEFAULT GETDATE(),
    [CompletedAt] [datetime] NULL,
    [Status] [nvarchar](20) DEFAULT 'Pending' CHECK ([Status] IN ('Completed', 'Pending'))
);
GO

-- Bảng PatientRequest (Yêu cầu của bệnh nhân)
CREATE TABLE [dbo].[PatientRequest](
    [RequestID] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [PatientID] [int] NULL,
    [NurseID] [int] NULL,
    [Content] [nvarchar](max) NOT NULL,
    [CreatedAt] [datetime] DEFAULT GETDATE(),
    [UpdatedAt] [datetime] NULL,
    [Status] [nvarchar](20) DEFAULT 'Pending' CHECK ([Status] IN ('Escalated', 'Completed', 'Processing', 'Pending'))
);
GO

-- Bảng EquipmentRequest (Yêu cầu thiết bị)
CREATE TABLE [dbo].[EquipmentRequest](
    [RequestID] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [StaffID] [int] NULL,
    [EquipmentID] [int] NULL,
    [Quantity] [int] NULL,
    [RequestDate] [datetime] DEFAULT GETDATE(),
    [Reason] [nvarchar](200) NULL,
    [PatientID] [int] NULL,
    [Status] [nvarchar](20) DEFAULT 'Pending',
    [Urgency] [nvarchar](20) DEFAULT 'Normal' CHECK ([Urgency] IN ('Critical', 'High', 'Normal', 'Low'))
);
GO

-- Bảng Schedule (Lịch làm việc chung)
CREATE TABLE [dbo].[Schedule](
    [ScheduleID] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [StaffID] [int] NULL,
    [Room] [nvarchar](50) NULL,
    [WorkDate] [date] NULL,
    [StartTime] [time](7) NULL,
    [EndTime] [time](7) NULL
);
GO

-- Bảng WorkSchedule (Lịch trực)
CREATE TABLE [dbo].[WorkSchedule](
    [ScheduleID] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [StaffID] [int] NULL,
    [WorkDate] [date] NOT NULL,
    [Note] [nvarchar](100) NULL,
    [ShiftType] [nvarchar](20) NULL CHECK ([ShiftType] IN ('Weekend', 'Night', 'Afternoon', 'Morning'))
);
GO

-- 3. TẠO KHÓA NGOẠI (FOREIGN KEYS)

ALTER TABLE [dbo].[Patient] WITH CHECK ADD FOREIGN KEY([NurseID]) REFERENCES [dbo].[Staff] ([StaffID]);

ALTER TABLE [dbo].[Appointment] WITH CHECK ADD FOREIGN KEY([DoctorID]) REFERENCES [dbo].[Staff] ([StaffID]);
ALTER TABLE [dbo].[Appointment] WITH CHECK ADD FOREIGN KEY([PatientID]) REFERENCES [dbo].[Patient] ([PatientID]);

ALTER TABLE [dbo].[MedicalRecord] WITH CHECK ADD FOREIGN KEY([DoctorID]) REFERENCES [dbo].[Staff] ([StaffID]);
ALTER TABLE [dbo].[MedicalRecord] WITH CHECK ADD FOREIGN KEY([PatientID]) REFERENCES [dbo].[Patient] ([PatientID]);

ALTER TABLE [dbo].[Prescription] WITH CHECK ADD FOREIGN KEY([RecordID]) REFERENCES [dbo].[MedicalRecord] ([RecordID]);

ALTER TABLE [dbo].[PrescriptionItem] WITH CHECK ADD FOREIGN KEY([MedicineID]) REFERENCES [dbo].[Medicine] ([MedicineID]);
ALTER TABLE [dbo].[PrescriptionItem] WITH CHECK ADD FOREIGN KEY([PrescriptionID]) REFERENCES [dbo].[Prescription] ([PrescriptionID]);

ALTER TABLE [dbo].[DoctorInstruction] WITH CHECK ADD FOREIGN KEY([DoctorID]) REFERENCES [dbo].[Staff] ([StaffID]);
ALTER TABLE [dbo].[DoctorInstruction] WITH CHECK ADD FOREIGN KEY([PatientID]) REFERENCES [dbo].[Patient] ([PatientID]);

ALTER TABLE [dbo].[PatientRequest] WITH CHECK ADD FOREIGN KEY([NurseID]) REFERENCES [dbo].[Staff] ([StaffID]);
ALTER TABLE [dbo].[PatientRequest] WITH CHECK ADD FOREIGN KEY([PatientID]) REFERENCES [dbo].[Patient] ([PatientID]);

ALTER TABLE [dbo].[EquipmentRequest] WITH CHECK ADD FOREIGN KEY([EquipmentID]) REFERENCES [dbo].[Equipment] ([EquipmentID]);
ALTER TABLE [dbo].[EquipmentRequest] WITH CHECK ADD FOREIGN KEY([PatientID]) REFERENCES [dbo].[Patient] ([PatientID]);
ALTER TABLE [dbo].[EquipmentRequest] WITH CHECK ADD FOREIGN KEY([StaffID]) REFERENCES [dbo].[Staff] ([StaffID]);

ALTER TABLE [dbo].[Schedule] WITH CHECK ADD FOREIGN KEY([StaffID]) REFERENCES [dbo].[Staff] ([StaffID]);
ALTER TABLE [dbo].[WorkSchedule] WITH CHECK ADD FOREIGN KEY([StaffID]) REFERENCES [dbo].[Staff] ([StaffID]);
GO