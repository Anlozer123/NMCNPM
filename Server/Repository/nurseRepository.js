const { sql } = require('../Config/db');

class NurseRepository {
    // UC010: Lấy danh sách y lệnh đang chờ xử lý
    async getPendingInstructions(nurseId) { // Thêm tham số nurseId
    const result = await sql.query`
        SELECT NI.*, P.FullName AS PatientName, P.Gender, P.CurrentRoom, 
               S.FullName AS DoctorName, S.Specialization 
        FROM NursingInstructions NI
        JOIN Patient P ON NI.PatientID = P.PatientID
        JOIN Staff S ON NI.DoctorID = S.StaffID
        WHERE NI.Status = N'Chờ xử lý' 
          AND NI.NurseID = ${nurseId} -- THÊM DÒNG NÀY ĐỂ LỌC ĐÚNG Y TÁ
        ORDER BY NI.CreatedAt ASC`;
        return result.recordset;
    }

    async updateInstructionStatus(id, status) {
        return await sql.query`
            UPDATE NursingInstructions -- Đã sửa tên bảng
            SET Status = ${status} 
            WHERE InstructionID = ${id}`;
    }

    // UC011: Thiết bị & Vật tư
    async getAllEquipments() {
        const result = await sql.query`SELECT * FROM Equipment`;
        return result.recordset;
    }

    async getEquipmentStock(itemId) {
        const result = await sql.query`SELECT Quantity FROM Equipment WHERE EquipmentID = ${itemId}`;
        return result.recordset[0];
    }

    async createEquipmentRequest(data) {
        const { nurseId, itemId, quantity, urgency, reason, patientId } = data;
        return await sql.query`
            INSERT INTO EquipmentRequest (StaffID, EquipmentID, Quantity, Urgency, Reason, Status, RequestDate, PatientID) 
            VALUES (${nurseId}, ${itemId}, ${quantity}, ${urgency}, ${reason}, 'Pending', GETDATE(), ${patientId})`;
    }

    async getEquipmentRequestHistory() {
        const result = await sql.query`
            SELECT ER.*, E.Name AS EquipmentName, P.FullName AS PatientName
            FROM EquipmentRequest ER
            JOIN Equipment E ON ER.EquipmentID = E.EquipmentID
            LEFT JOIN Patient P ON ER.PatientID = P.PatientID
            ORDER BY ER.RequestDate DESC`;
        return result.recordset;
    }

    // UC12 & UC13: Bệnh nhân
    async getPatientsByNurse(nurseId) {
        const result = await sql.query`
            SELECT *, DATEDIFF(year, DoB, GETDATE()) AS Age 
            FROM Patient WHERE NurseID = ${nurseId}`;
        return result.recordset;
    }

    async getPendingPatientRequests() {
        const result = await sql.query`
            SELECT PR.*, P.FullName AS PatientName, P.CurrentRoom
            FROM PatientRequest PR
            JOIN Patient P ON PR.PatientID = P.PatientID
            WHERE PR.Status IN ('Pending', 'Processing') 
            ORDER BY PR.CreatedAt ASC`;
        return result.recordset;
    }

    async updatePatientRequest(requestId, status, note) {
        return await sql.query`
            UPDATE PatientRequest 
            SET Status = ${status}, NurseNote = ${note}, UpdatedAt = GETDATE() 
            WHERE RequestID = ${requestId}`;
    }

    // Stats & Profile
    async getStaffProfile(id) {
        const result = await sql.query`SELECT StaffID, FullName, DoB, Phone, Email, Role FROM Staff WHERE StaffID = ${id}`;
        return result.recordset[0];
    }

    async countStats(nurseId) {
        // Cập nhật đếm y lệnh theo trạng thái tiếng Việt
        const instructions = await sql.query`
        SELECT COUNT(*) AS count 
        FROM NursingInstructions 
        WHERE Status = N'Chờ xử lý' 
        AND NurseID = ${nurseId}`;
        
        const patientReqs = await sql.query`SELECT COUNT(*) AS count FROM PatientRequest WHERE Status = 'Pending'`;
        const myPatients = await sql.query`SELECT COUNT(*) AS count FROM Patient WHERE NurseID = ${nurseId}`;
        const approvedEquip = await sql.query`SELECT COUNT(*) AS count FROM EquipmentRequest WHERE StaffID = ${nurseId} AND Status IN ('Approved', 'Delivered')`;
        const pendingEquip = await sql.query`SELECT COUNT(*) AS count FROM EquipmentRequest WHERE StaffID = ${nurseId} AND Status = 'Pending'`;

        return {
            instructionCount: instructions.recordset[0].count,
            requestCount: patientReqs.recordset[0].count,
            patientCount: myPatients.recordset[0].count,
            equipApprovedCount: approvedEquip.recordset[0].count,
            equipPendingCount: pendingEquip.recordset[0].count
        };
    }
}

module.exports = new NurseRepository();