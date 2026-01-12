const { sql } = require('../Config/db');

class AdminRepository {
    async getAdminById(id) {
        const result = await sql.query`SELECT StaffID, FullName, DoB, Phone, Email, Role FROM Staff WHERE StaffID = ${id}`;
        return result.recordset[0];
    }

    async getSchedules() {
        return await sql.query`
            SELECT WS.ScheduleID, WS.WorkDate, WS.ShiftType, S.StaffID, S.FullName, S.Role, S.Specialization
            FROM WorkSchedule WS
            JOIN Staff S ON WS.StaffID = S.StaffID
            ORDER BY S.StaffID, WS.WorkDate`;
    }

    async getStaffForSchedule() {
        return await sql.query`SELECT StaffID, FullName, Role, Specialization FROM Staff WHERE Role IN ('Doctor', 'Nurse') ORDER BY Role, FullName`;
    }

    async getAllPatients() {
        return await sql.query`
            SELECT P.PatientID, P.FullName, P.Gender, P.DoB, P.Phone, P.Address, P.CurrentRoom, P.Email, P.NurseID, 
            DATEDIFF(year, P.DoB, GETDATE()) AS Age
            FROM Patient P ORDER BY P.FullName ASC`;
    }

    async createPatient(data) {
        return await sql.query`INSERT INTO Patient (FullName, Gender, DoB, Phone, Address, PasswordHash)
            VALUES (${data.fullName}, ${data.gender}, ${data.dob}, ${data.phone}, ${data.address}, '123456')`;
    }

    async updatePatient(id, query) {
        return await sql.query(query);
    }

    async getAllStaff() {
        return await sql.query`SELECT StaffID, FullName, Role, Specialization, Phone, Email FROM Staff WHERE Role IN ('Doctor', 'Nurse') ORDER BY Role, FullName`;
    }

    async createStaff(data) {
        return await sql.query`
            INSERT INTO Staff (FullName, Role, Specialization, Phone, Email, PasswordHash)
            VALUES (N${data.fullName}, ${data.role}, N${data.specialization}, ${data.phone}, ${data.email}, ${data.password || '123456'})`;
    }

    async updateStaff(id, query) {
        return await sql.query(query);
    }

    async getStats() {
        const patients = await sql.query`SELECT COUNT(*) AS count FROM Patient`;
        const doctors = await sql.query`SELECT COUNT(*) AS count FROM Staff WHERE Role = 'Doctor'`;
        const nurses = await sql.query`SELECT COUNT(*) AS count FROM Staff WHERE Role = 'Nurse'`;
        const requests = await sql.query`SELECT COUNT(*) AS count FROM PatientRequest WHERE Status = 'Pending'`;
        return {
            patientCount: patients.recordset[0].count,
            doctorCount: doctors.recordset[0].count,
            nurseCount: nurses.recordset[0].count,
            appointmentCount: 0,
            requestCount: requests.recordset[0].count
        };
    }
}

module.exports = new AdminRepository();