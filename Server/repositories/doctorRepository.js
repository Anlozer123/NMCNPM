const { sql, poolPromise } = require('../config/db.config');

class DoctorRepository {
    async getMyPatients(doctorId) {
        const pool = await poolPromise;
        const result = await pool.request().input('did', sql.Int, doctorId).query(`
            SELECT DISTINCT P.* FROM Appointments A
            JOIN Patients P ON A.PatientID = P.PatientID
            WHERE A.DoctorID = @did AND A.Status = 'Confirmed'
        `);
        return result.recordset;
    }

    async createPrescriptionTransaction(data) {
        const pool = await poolPromise;
        const transaction = new sql.Transaction(pool);
        try {
            await transaction.begin();
            // 1. Hồ sơ
            const recordResult = await transaction.request()
                .input('pid', sql.Int, data.patientId).input('did', sql.Int, data.doctorId)
                .input('diag', sql.NVarChar, data.diagnosis).input('treat', sql.NVarChar, data.treatmentPlan)
                .query(`INSERT INTO MedicalRecords (PatientID, DoctorID, Diagnosis, TreatmentPlan) OUTPUT INSERTED.RecordID VALUES (@pid, @did, @diag, @treat)`);
            const recordId = recordResult.recordset[0].RecordID;

            // 2. Đơn thuốc Header
            const presResult = await transaction.request()
                .input('rid', sql.Int, recordId).input('note', sql.NVarChar, data.doctorNote)
                .query(`INSERT INTO Prescriptions (RecordID, DoctorNote) OUTPUT INSERTED.PrescriptionID VALUES (@rid, @note)`);
            const presId = presResult.recordset[0].PrescriptionID;

            // 3. Chi tiết thuốc
            for (const item of data.medicines) {
                await transaction.request()
                    .input('pid', sql.Int, presId).input('mid', sql.Int, item.medicineId)
                    .input('qty', sql.Int, item.quantity).input('dos', sql.NVarChar, item.dosage)
                    .query(`INSERT INTO PrescriptionItems (PrescriptionID, MedicineID, Quantity, Dosage) VALUES (@pid, @mid, @qty, @dos)`);
            }
            await transaction.commit();
            return { recordId };
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    }

    async createInstruction(data) {
        const pool = await poolPromise;
        await pool.request()
            .input('did', sql.Int, data.doctorId).input('pid', sql.Int, data.patientId).input('content', sql.NVarChar, data.content)
            .query(`INSERT INTO DoctorInstructions (DoctorID, PatientID, Content) VALUES (@did, @pid, @content)`);
        return true;
    }

    async getPendingConsultations() {
        const pool = await poolPromise;
        const result = await pool.request().query(`
            SELECT C.*, P.FullName as PatientName FROM ConsultationRequests C
            JOIN Patients P ON C.PatientID = P.PatientID WHERE C.Status = 'Pending'
        `);
        return result.recordset;
    }

    async replyConsultation(requestId, doctorId, response) {
        const pool = await poolPromise;
        await pool.request()
            .input('id', sql.Int, requestId).input('did', sql.Int, doctorId).input('res', sql.NVarChar, response)
            .query(`UPDATE ConsultationRequests SET DoctorID = @did, Response = @res, Status = 'Replied', RepliedAt = GETDATE() WHERE RequestID = @id`);
        return true;
    }
}
module.exports = new DoctorRepository();