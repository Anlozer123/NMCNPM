const { sql, poolPromise } = require('../config/db.config');

class NurseRepository {
    async getTodaySchedule() {
        const pool = await poolPromise;
        const result = await pool.request().query(`
            SELECT A.*, P.FullName as PatientName, S.FullName as DoctorName 
            FROM Appointments A 
            JOIN Patients P ON A.PatientID = P.PatientID
            JOIN Staff S ON A.DoctorID = S.StaffID
            WHERE A.Date = CAST(GETDATE() AS DATE)
        `);
        return result.recordset;
    }

    async getPendingInstructions() {
        const pool = await poolPromise;
        const result = await pool.request().query(`
            SELECT D.*, S.FullName as DoctorName, P.FullName as PatientName 
            FROM DoctorInstructions D
            JOIN Staff S ON D.DoctorID = S.StaffID
            JOIN Patients P ON D.PatientID = P.PatientID
            WHERE D.Status = 'Pending'
        `);
        return result.recordset;
    }

    async completeInstruction(id) {
        const pool = await poolPromise;
        await pool.request().input('id', sql.Int, id).query(`UPDATE DoctorInstructions SET Status = 'Completed', CompletedAt = GETDATE() WHERE InstructionID = @id`);
        return true;
    }

    async getPatientRequests() {
        const pool = await poolPromise;
        const result = await pool.request().query(`
            SELECT PR.*, P.FullName as PatientName FROM PatientRequests PR
            JOIN Patients P ON PR.PatientID = P.PatientID WHERE PR.Status = 'Pending'
        `);
        return result.recordset;
    }

    async handlePatientRequest(id, nurseId) {
        const pool = await poolPromise;
        await pool.request().input('id', sql.Int, id).input('nid', sql.Int, nurseId)
            .query(`UPDATE PatientRequests SET NurseID = @nid, Status = 'Completed' WHERE RequestID = @id`);
        return true;
    }

    async requestEquipment(data) {
        const pool = await poolPromise;
        await pool.request()
            .input('nid', sql.Int, data.nurseId).input('eid', sql.Int, data.equipmentId)
            .input('qty', sql.Int, data.quantity).input('reason', sql.NVarChar, data.reason)
            .query(`INSERT INTO EquipmentRequests (NurseID, EquipmentID, Quantity, Reason) VALUES (@nid, @eid, @qty, @reason)`);
        return true;
    }

    async getAllEquipments() {
        const pool = await poolPromise;
        const result = await pool.request().query(`SELECT * FROM Equipments`);
        return result.recordset;
    }
}
module.exports = new NurseRepository();