const { sql } = require('../Config/db');

class NurseRepository {
    // UC010: Lấy danh sách y lệnh Pending
    async getPendingInstructions() {
        const result = await sql.query`
            SELECT DI.*, P.FullName AS PatientName, P.Gender, P.CurrentRoom, 
                   S.FullName AS DoctorName, S.Specialization 
            FROM DoctorInstruction DI
            JOIN Patient P ON DI.PatientID = P.PatientID
            JOIN Staff S ON DI.DoctorID = S.StaffID
            WHERE DI.Status = 'Pending' 
            ORDER BY DI.CreatedAt ASC`;
        return result.recordset;
    }

    async updateInstructionStatus(id, status) {
        return await sql.query`
            UPDATE DoctorInstruction 
            SET Status = ${status}, CompletedAt = GETDATE() 
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
        const instructions = await sql.query`SELECT COUNT(*) AS count FROM DoctorInstruction WHERE Status = 'Pending'`;
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