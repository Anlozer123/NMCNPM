const { sql } = require('../Config/db');

class DoctorRepository {

    async getAppointmentsByDoctor(doctorId) {
        const result = await sql.query`
            SELECT a.AppointmentID, a.PatientID, a.AppointmentDate, a.Status, a.Reason, 
                   p.FullName AS PatientName, p.Gender
            FROM Appointment a
            JOIN Patient p ON a.PatientID = p.PatientID
            WHERE a.DoctorID = ${doctorId}
            ORDER BY a.AppointmentDate ASC
        `;
        return result.recordset;
    }

    // --- Các hàm hỗ trợ Transaction cho Kê đơn ---
    async createMedicalRecord(transaction, { patientId, doctorId, diagnosis, notes }) {
        const request = new sql.Request(transaction);
        const result = await request.query`
            INSERT INTO MedicalRecord (PatientID, DoctorID, Diagnosis, Notes, Date)
            OUTPUT INSERTED.RecordID
            VALUES (${patientId}, ${doctorId}, ${diagnosis}, ${notes}, GETDATE())
        `;
        return result.recordset[0].RecordID;
    }

    async createPrescription(transaction, recordId) {
        const request = new sql.Request(transaction);
        const result = await request.query`
            INSERT INTO Prescription (RecordID, CreatedDate)
            OUTPUT INSERTED.PrescriptionID
            VALUES (${recordId}, GETDATE())
        `;
        return result.recordset[0].PrescriptionID;
    }

    async addPrescriptionItem(transaction, { prescriptionId, item }) {
        const request = new sql.Request(transaction);
        await request.query`
            INSERT INTO PrescriptionItem (PrescriptionID, MedicineID, Quantity, Dosage, Frequency, Duration, Note)
            VALUES (${prescriptionId}, ${item.medicineId}, ${item.quantity}, ${item.dosage}, ${item.frequency}, ${item.duration}, ${item.note})
        `;
    }

    // [SỬA]: Thêm điều kiện StockQuantity >= quantity để không bị trừ âm kho
    async decreaseMedicineStock(transaction, { medicineId, quantity }) {
        const request = new sql.Request(transaction);
        const result = await request.query`
            UPDATE Medicine 
            SET StockQuantity = StockQuantity - ${quantity} 
            WHERE MedicineID = ${medicineId} AND StockQuantity >= ${quantity}
        `;
        
        // Nếu không có dòng nào được cập nhật nghĩa là hết hàng hoặc sai ID
        if (result.rowsAffected[0] === 0) {
            throw new Error("Số lượng thuốc trong kho không đủ để thực hiện kê đơn!");
        }
    }
    // ---------------------------------------------

    async getAvailableMedicines() {
        const result = await sql.query`
            SELECT MedicineID, Name, StockQuantity, UnitPrice 
            FROM Medicine WHERE StockQuantity > 0 ORDER BY Name ASC
        `;
        return result.recordset;
    }

    async getPrescriptionHistoryRaw(patientId) {
        const result = await sql.query`
            SELECT pr.PrescriptionID, pr.CreatedDate, mr.Diagnosis, mr.Notes,
                   m.Name AS DrugName, pi.Quantity, pi.Dosage, pi.Frequency, pi.Duration,
                   s.FullName AS DoctorName
            FROM Prescription pr
            JOIN MedicalRecord mr ON pr.RecordID = mr.RecordID
            JOIN PrescriptionItem pi ON pr.PrescriptionID = pi.PrescriptionID
            JOIN Medicine m ON pi.MedicineID = m.MedicineID
            JOIN Staff s ON mr.DoctorID = s.StaffID
            WHERE mr.PatientID = ${patientId}
            ORDER BY pr.CreatedDate DESC
        `;
        return result.recordset;
    }

    async getMyPatients(doctorId) {
        const result = await sql.query`
            SELECT DISTINCT p.PatientID, p.FullName, p.Gender, p.DoB, p.Phone, p.Email, p.Address, p.CurrentRoom AS RoomNumber
            FROM Patient p
            JOIN Appointment a ON p.PatientID = a.PatientID
            WHERE a.DoctorID = ${doctorId}
            ORDER BY p.FullName ASC
        `;
        return result.recordset;
    }

    async getPatientDetail(patientId) {
        const result = await sql.query`
            SELECT p.PatientID, p.FullName, p.Gender, p.DoB, p.Phone, p.Email, p.Address,
                   p.InsuranceID, p.BloodGroup, p.Allergies, p.MedicalHistory, 
                   p.CurrentRoom, p.AdmissionDiagnosis, p.CurrentCondition,
                   p.RelativeName, p.RelativePhone, p.Relationship
            FROM Patient p WHERE p.PatientID = ${patientId}
        `;
        return result.recordset[0];
    }

    async updatePatientProfile(patientId, data) {
        const result = await sql.query`
            UPDATE Patient
            SET FullName = ${data.FullName}, Gender = ${data.Gender}, DoB = ${data.DoB},
                Phone = ${data.Phone}, Address = ${data.Address}, InsuranceID = ${data.InsuranceID},
                BloodGroup = ${data.BloodGroup}, Allergies = ${data.Allergies}, MedicalHistory = ${data.MedicalHistory},
                CurrentRoom = ${data.CurrentRoom}, AdmissionDiagnosis = ${data.AdmissionDiagnosis}, CurrentCondition = ${data.CurrentCondition},
                RelativeName = ${data.RelativeName}, RelativePhone = ${data.RelativePhone}, Relationship = ${data.Relationship}
            WHERE PatientID = ${patientId}
        `;
        return result;
    }

    async getInstructionHistory(patientId) {
        const result = await sql.query`
            SELECT ni.InstructionType AS type, ni.Priority AS priority, ni.Content AS content,
                   ni.Status AS status, FORMAT(ni.CreatedAt, 'dd/MM/yyyy HH:mm') AS time,
                   s.FullName AS nurseName
            FROM NursingInstructions ni
            LEFT JOIN Staff s ON ni.NurseID = s.StaffID
            WHERE ni.PatientID = ${patientId}
            ORDER BY ni.CreatedAt DESC
        `;
        return result.recordset;
    }

    async getNurses() {
        const result = await sql.query`
            SELECT StaffID, FullName FROM Staff 
            WHERE Role = N'Nurse' OR Role = N'Điều dưỡng'
            ORDER BY FullName ASC
        `;
        return result.recordset;
    }

    async createInstruction({ patientId, doctorId, nurseId, type, priority, content }) {
        return await sql.query`
            INSERT INTO NursingInstructions (PatientID, DoctorID, NurseID, InstructionType, Priority, Content, Status)
            VALUES (${patientId}, ${doctorId}, ${nurseId}, ${type}, ${priority}, ${content}, N'Chờ xử lý')
        `;
    }

    // [SỬA]: Thêm tham số doctorId để lọc yêu cầu tư vấn theo chuyên khoa của bác sĩ đó
    async getConsultationRequests(doctorId) {
        const result = await sql.query`
            SELECT cr.RequestID, cr.PatientID, p.FullName AS PatientName,
                   cr.Specialty, cr.Priority, cr.Symptoms, cr.Status,
                   FORMAT(cr.CreatedDate, 'dd/MM/yyyy HH:mm') AS CreatedTime
            FROM ConsultationRequests cr
            JOIN Patient p ON cr.PatientID = p.PatientID
            WHERE cr.Specialty = (SELECT Specialization FROM Staff WHERE StaffID = ${doctorId})
            ORDER BY CASE WHEN cr.Status = N'Chờ phản hồi' THEN 0 ELSE 1 END, cr.CreatedDate DESC
        `;
        return result.recordset;
    }

    async getConsultationMessages(requestId) {
        const result = await sql.query`
            SELECT MessageID, SenderID, SenderType, Content, SentAt
            FROM ConsultationMessages WHERE RequestID = ${requestId} ORDER BY SentAt ASC
        `;
        return result.recordset;
    }

    // --- Các hàm hỗ trợ Transaction cho Chat Reply ---
    async createConsultationMessage(transaction, { requestId, doctorId, content }) {
        const request = new sql.Request(transaction);
        request.input('RequestID', sql.Int, requestId);
        request.input('DoctorID', sql.Int, doctorId);
        request.input('Content', sql.NVarChar, content);
        
        const result = await request.query(`
            INSERT INTO ConsultationMessages (RequestID, SenderID, SenderType, Content)
            OUTPUT INSERTED.MessageID
            VALUES (@RequestID, @DoctorID, 'Doctor', @Content)
        `);
        return result.recordset[0].MessageID;
    }

    async updateConsultationStatus(transaction, { requestId, doctorId }) {
        const request = new sql.Request(transaction);
        request.input('RequestID', sql.Int, requestId);
        request.input('DoctorID', sql.Int, doctorId);
        
        await request.query(`
            UPDATE ConsultationRequests
            SET Status = N'Đã phản hồi', DoctorID = @DoctorID, ResponseDate = GETDATE()
            WHERE RequestID = @RequestID
        `);
    }

    async getWorkSchedule(doctorId) {
    const result = await sql.query`
        SELECT ScheduleID, WorkDate, ShiftType, Note
        FROM WorkSchedule
        WHERE StaffID = ${doctorId}
        AND WorkDate >= CAST(GETDATE() AS DATE) -- Lấy từ ngày hôm nay trở đi
        ORDER BY WorkDate ASC
    `;
    return result.recordset;
    }

    async checkDuplicateInfo(excludePatientId, phone, insuranceId) {
        const result = await sql.query`
        -- Tìm trong bảng Patient, bỏ qua chính bệnh nhân đang sửa (PatientID <> excludePatientId)
            SELECT 'Bệnh nhân' AS Source FROM Patient 
            WHERE (Phone = ${phone} OR InsuranceID = ${insuranceId}) AND PatientID <> ${excludePatientId}
        
            UNION
        
            -- Tìm trong bảng Staff (Nhân viên) xem có trùng số điện thoại không
            SELECT 'Nhân viên' AS Source FROM Staff WHERE Phone = ${phone}`;
    
        return result.recordset[0]; // Trả về bản ghi đầu tiên tìm thấy (nếu có)
    }
}

module.exports = new DoctorRepository();