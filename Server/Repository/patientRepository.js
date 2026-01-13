const { sql } = require('../Config/db');

class PatientRepository {
    
    // Lấy thông tin cơ bản
    async getPatientById(patientId) {
        const result = await sql.query`
            SELECT PatientID, FullName, Gender, DoB, Phone, Email, Address, 
                   Height, Weight, BMI, HeartRate, BloodSugar, SystolicBP, DiastolicBP
            FROM Patient WHERE PatientID = ${patientId}
        `;
        return result.recordset[0];
    }

    // Lấy dữ liệu thô đơn thuốc (Flat data)
    async getPrescriptionsRaw(patientId) {
        // [FIX]: Sử dụng LEFT JOIN để lấy cả đơn thuốc chưa có thuốc hoặc bị lỗi liên kết thuốc
        const query = `
            SELECT P.PrescriptionID, P.CreatedDate, S.FullName AS DoctorName,
                   M.Name AS MedicineName, 
                   ISNULL(M.UnitPrice, 0) AS UnitPrice, 
                   ISNULL(PI.Quantity, 0) AS Quantity,
                   ISNULL(M.UnitPrice * PI.Quantity, 0) AS TotalLine
            FROM Prescription P
            JOIN MedicalRecord MR ON P.RecordID = MR.RecordID
            JOIN Staff S ON MR.DoctorID = S.StaffID
            LEFT JOIN PrescriptionItem PI ON P.PrescriptionID = PI.PrescriptionID -- Sửa thành LEFT JOIN
            LEFT JOIN Medicine M ON PI.MedicineID = M.MedicineID -- Sửa thành LEFT JOIN
            WHERE MR.PatientID = @PatientID
            ORDER BY P.CreatedDate DESC
        `;
        const request = new sql.Request();
        request.input('PatientID', sql.Int, patientId);
        return await request.query(query);
    }
    // Insert Request (Hỗ trợ Transaction)
    async createConsultationRequest(transaction, { patientId, department, urgency, symptoms }) {
        const request = new sql.Request(transaction);
        request.input('PatientID', sql.Int, patientId);
        request.input('Specialty', sql.NVarChar, department);
        request.input('Priority', sql.NVarChar, urgency);
        request.input('Symptoms', sql.NVarChar, symptoms);

        const query = `
            INSERT INTO ConsultationRequests (PatientID, Specialty, Priority, Symptoms)
            OUTPUT INSERTED.RequestID
            VALUES (@PatientID, @Specialty, @Priority, @Symptoms)
        `;
        const result = await request.query(query);
        return result.recordset[0].RequestID;
    }

    // Insert Message (Hỗ trợ Transaction)
    async createConsultationMessage(transaction, { requestId, senderId, senderType, content }) {
        // Nếu không có transaction (trường hợp reply bình thường), tạo request mới
        const request = transaction ? new sql.Request(transaction) : new sql.Request();
        
        request.input('RequestID', sql.Int, requestId);
        request.input('SenderID', sql.Int, senderId);
        request.input('SenderType', sql.NVarChar, senderType);
        request.input('Content', sql.NVarChar, content);

        const query = `
            INSERT INTO ConsultationMessages (RequestID, SenderID, SenderType, Content)
            OUTPUT INSERTED.MessageID
            VALUES (@RequestID, @SenderID, @SenderType, @Content)
        `;
        const result = await request.query(query);
        return result.recordset[0].MessageID;
    }

    async getLatestConsultation(patientId) {
        const request = new sql.Request();
        request.input('PatientID', sql.Int, patientId);
        const result = await request.query(`
            SELECT TOP 1 RequestID, Specialty, Priority, Symptoms, 
                   ResponseContent, Status, CreatedDate, ResponseDate
            FROM ConsultationRequests
            WHERE PatientID = @PatientID ORDER BY CreatedDate DESC
        `);
        return result.recordset[0];
    }

    async getDoctorsList() {
        const result = await sql.query`SELECT StaffID, FullName, Specialization FROM Staff WHERE Role = 'Doctor'`;
        return result.recordset;
    }

    async getAppointments(patientId) {
        const request = new sql.Request();
        request.input('PatientID', sql.Int, patientId);
        const result = await request.query(`
            SELECT A.AppointmentID, S.FullName AS DoctorName, S.Specialization,
                   A.AppointmentDate, A.Reason, A.Status
            FROM Appointment A
            JOIN Staff S ON A.DoctorID = S.StaffID
            WHERE A.PatientID = @PatientID AND A.Status != 'Cancelled' 
            ORDER BY A.AppointmentDate DESC
        `);
        return result.recordset;
    }

    async createAppointment({ patientId, doctorId, appointmentDate, reason }) {
        const request = new sql.Request();
        request.input('PatientID', sql.Int, patientId);
        request.input('DoctorID', sql.Int, doctorId);
        request.input('AppointmentDate', sql.DateTime, appointmentDate); 
        request.input('Reason', sql.NVarChar, reason);
        
        return await request.query(`
            INSERT INTO Appointment (PatientID, DoctorID, AppointmentDate, Reason, Status)
            VALUES (@PatientID, @DoctorID, @AppointmentDate, @Reason, 'Pending')
        `);
    }

    async cancelAppointment(appointmentId) {
        const request = new sql.Request();
        request.input('AppointmentID', sql.Int, appointmentId);
        return await request.query(`UPDATE Appointment SET Status = 'Cancelled' WHERE AppointmentID = @AppointmentID`);
    }

    async getRequestInfo(patientId) {
        const request = new sql.Request();
        request.input('PatientID', sql.Int, patientId);
        const result = await request.query(`
            SELECT TOP 1 R.RequestID, R.Specialty, R.Priority, R.Status, R.CreatedDate, S.FullName AS DoctorName
            FROM ConsultationRequests R
            LEFT JOIN Staff S ON R.DoctorID = S.StaffID
            WHERE R.PatientID = @PatientID ORDER BY R.CreatedDate DESC
        `);
        return result.recordset[0];
    }

    async getMessagesByRequestId(requestId) {
        const request = new sql.Request();
        request.input('RequestID', sql.Int, requestId);
        const result = await request.query(`
            SELECT MessageID, SenderID, SenderType, Content, SentAt, UpdatedAt
            FROM ConsultationMessages WHERE RequestID = @RequestID ORDER BY SentAt ASC
        `);
        return result.recordset;
    }

    async updateMessage({ messageId, senderId, content }) {
        const request = new sql.Request();
        request.input('MessageID', sql.Int, messageId);
        request.input('SenderID', sql.Int, senderId);
        request.input('Content', sql.NVarChar, content);
        
        const result = await request.query(`
            UPDATE ConsultationMessages SET Content = @Content, UpdatedAt = GETDATE()
            WHERE MessageID = @MessageID AND SenderID = @SenderID
        `);
        return result.rowsAffected[0];
    }

    async deleteMessage({ messageId, senderId }) {
        const request = new sql.Request();
        request.input('MessageID', sql.Int, messageId);
        request.input('SenderID', sql.Int, senderId);
        
        const result = await request.query(`
            DELETE FROM ConsultationMessages WHERE MessageID = @MessageID AND SenderID = @SenderID
        `);
        return result.rowsAffected[0];
    }
    async getAllConsultations(patientId) {
    const request = new sql.Request();
    request.input('PatientID', sql.Int, patientId);
    // Lấy danh sách, sắp xếp mới nhất lên đầu
    const result = await request.query(`
        SELECT R.RequestID, R.Specialty, R.Priority, R.Status, R.CreatedDate, S.FullName AS DoctorName
        FROM ConsultationRequests R
        LEFT JOIN Staff S ON R.DoctorID = S.StaffID
        WHERE R.PatientID = @PatientID
        ORDER BY R.CreatedDate DESC
    `);
    return result.recordset;
}

// [THÊM MỚI] Lấy thông tin chi tiết của MỘT request cụ thể theo ID
    async getRequestById(requestId) {
        const request = new sql.Request();
        request.input('RequestID', sql.Int, requestId);
        const result = await request.query(`
            SELECT R.RequestID, R.Specialty, R.Priority, R.Status, R.CreatedDate, S.FullName AS DoctorName
            FROM ConsultationRequests R
            LEFT JOIN Staff S ON R.DoctorID = S.StaffID
            WHERE R.RequestID = @RequestID
        `);
        return result.recordset[0];
    }
    async createNurseRequest({ patientId, content }) {
        const request = new sql.Request();
        request.input('PatientID', sql.Int, patientId);
        request.input('Content', sql.NVarChar, content);
        const query = `
            INSERT INTO PatientRequest (PatientID, Content, Status, CreatedAt)
            VALUES (@PatientID, @Content, 'Pending', GETDATE())
        `;
        return await request.query(query);
    }
    async getNurseRequests(patientId) {
        const request = new sql.Request();
        request.input('PatientID', sql.Int, patientId);
        
        const query = `
            SELECT RequestID, Content, Status, CreatedAt, UpdatedAt
            FROM PatientRequest
            WHERE PatientID = @PatientID
            ORDER BY CreatedAt DESC
        `;
        const result = await request.query(query);
        return result.recordset;
    }
    
}

module.exports = new PatientRepository();