const { sql, poolPromise } = require('../config/db.config');

class AppointmentRepository {
    async checkAvailability(doctorId, date, startTime, endTime) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('did', sql.Int, doctorId).input('date', sql.Date, date)
            .input('start', sql.Time, startTime).input('end', sql.Time, endTime)
            .query(`SELECT COUNT(*) as count FROM Appointments WHERE DoctorID = @did AND Date = @date AND Status != 'Cancelled' AND ((StartTime <= @start AND EndTime > @start) OR (StartTime < @end AND EndTime >= @end))`);
        return result.recordset[0].count > 0;
    }

    async create(data) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('pid', sql.Int, data.patientId).input('did', sql.Int, data.doctorID)
            .input('date', sql.Date, data.date).input('start', sql.Time, data.startTime).input('end', sql.Time, data.endTime).input('note', sql.NVarChar, data.notes)
            .query(`INSERT INTO Appointments (PatientID, DoctorID, Date, StartTime, EndTime, Status, Notes) OUTPUT INSERTED.AppointmentID VALUES (@pid, @did, @date, @start, @end, 'Pending', @note)`);
        return result.recordset[0];
    }
}
module.exports = new AppointmentRepository();