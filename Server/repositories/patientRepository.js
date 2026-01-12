const { sql, poolPromise } = require('../config/db.config');

class PatientRepository {
    async getProfile(patientId) {
        const pool = await poolPromise;
        const result = await pool.request().input('id', sql.Int, patientId)
            .query(`SELECT * FROM Patients WHERE PatientID = @id`);
        return result.recordset[0];
    }

    async getMedicalHistory(patientId) {
        const pool = await poolPromise;
        const result = await pool.request().input('pid', sql.Int, patientId).query(`
            SELECT MR.Date, MR.Diagnosis, MR.TreatmentPlan, S.FullName as DoctorName, P.DoctorNote, M.Name as MedicineName, PI.Quantity, PI.Dosage
            FROM MedicalRecords MR
            JOIN Staff S ON MR.DoctorID = S.StaffID
            LEFT JOIN Prescriptions P ON MR.RecordID = P.RecordID
            LEFT JOIN PrescriptionItems PI ON P.PrescriptionID = PI.PrescriptionID
            LEFT JOIN Medicines M ON PI.MedicineID = M.MedicineID
            WHERE MR.PatientID = @pid ORDER BY MR.Date DESC
        `);
        return result.recordset;
    }

    async createConsultation(data) {
        const pool = await poolPromise;
        await pool.request()
            .input('pid', sql.Int, data.patientId)
            .input('title', sql.NVarChar, data.title)
            .input('question', sql.NVarChar, data.question)
            .query(`INSERT INTO ConsultationRequests (PatientID, Title, Question) VALUES (@pid, @title, @question)`);
        return true;
    }

    async getMyConsultations(patientId) {
        const pool = await poolPromise;
        const result = await pool.request().input('pid', sql.Int, patientId).query(`
            SELECT C.*, S.FullName as DoctorName FROM ConsultationRequests C
            LEFT JOIN Staff S ON C.DoctorID = S.StaffID
            WHERE C.PatientID = @pid ORDER BY C.CreatedAt DESC
        `);
        return result.recordset;
    }

    async createPatientRequest(data) {
        const pool = await poolPromise;
        // Gửi yêu cầu hỗ trợ (chăn màn, nước...) đến Y tá
        await pool.request()
            .input('pid', sql.Int, data.patientId)
            .input('content', sql.NVarChar, data.content)
            .query(`INSERT INTO PatientRequests (PatientID, Content) VALUES (@pid, @content)`);
        return true;
    }
}
module.exports = new PatientRepository();