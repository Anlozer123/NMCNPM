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

    async checkDuplicatePatient(phone, email, excludeId = null) {
        let query = `SELECT PatientID, Phone, Email FROM Patient WHERE (Phone = '${phone}'`;
        
        if (email && email.trim() !== '') {
            query += ` OR Email = '${email}'`;
        }
        query += `)`;

        if (excludeId) {
            query += ` AND PatientID != ${excludeId}`;
        }

        return await sql.query(query);
    }

    async checkDuplicateStaff(phone, email, excludeId = null) {
        let query = `SELECT StaffID, Phone, Email FROM Staff WHERE (Phone = '${phone}'`;
        
        if (email && email.trim() !== '') {
            query += ` OR Email = '${email}'`;
        }
        query += `)`;

        if (excludeId) {
            query += ` AND StaffID != ${excludeId}`;
        }

        return await sql.query(query);
    }

    async createStaff(data) {
        return await sql.query`
            INSERT INTO Staff (FullName, Role, Specialization, Phone, Email, PasswordHash, DoB)
            VALUES (
                ${data.fullName}, 
                ${data.role}, 
                ${data.specialization}, 
                ${data.phone}, 
                ${data.email}, 
                ${data.password || '123456'},
                ${data.dob || null}
            )`;
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

    async createSchedule(data) {
        return await sql.query`
            INSERT INTO WorkSchedule (StaffID, WorkDate, ShiftType)
            VALUES (${data.staffId}, ${data.workDate}, ${data.shiftType})`;
    }

    async checkExistingSchedule(staffId, workDate) {
        return await sql.query`
            SELECT ScheduleID, ShiftType 
            FROM WorkSchedule 
            WHERE StaffID = ${staffId} AND WorkDate = ${workDate}`;
    }

    async getEquipmentRequestsByStatus(status) {
        return await sql.query`
            SELECT R.RequestID, R.Quantity, R.RequestDate, R.Reason, R.Urgency, R.Status,
                   S.FullName AS StaffName, S.Role,
                   E.Name AS EquipmentName,
                   R.PatientID --(Hoặc join bảng Patient lấy tên nếu cần)
            FROM EquipmentRequest R
            LEFT JOIN Staff S ON R.StaffID = S.StaffID
            LEFT JOIN Equipment E ON R.EquipmentID = E.EquipmentID
            WHERE R.Status = ${status}
            ORDER BY R.RequestDate DESC`;
    }

    async updateRequestStatus(id, status) {
        return await sql.query`
            UPDATE EquipmentRequest 
            SET Status = ${status} 
            WHERE RequestID = ${id}`;
    }

    async approveRequestTransaction(requestId) {
        const transaction = new sql.Transaction();
        
        try {
            await transaction.begin();
            const reqResult = await transaction.request()
                .input('rid', sql.Int, requestId)
                .query(`SELECT EquipmentID, Quantity FROM EquipmentRequest WHERE RequestID = @rid`);
            
            if (reqResult.recordset.length === 0) throw new Error("Yêu cầu không tồn tại");
            
            const requestData = reqResult.recordset[0];
            const equipId = requestData.EquipmentID;
            const requestQty = requestData.Quantity;

            const equipResult = await transaction.request()
                .input('eid', sql.Int, equipId)
                .query(`SELECT Quantity, Name, Status FROM Equipment WHERE EquipmentID = @eid`);

            if (equipResult.recordset.length === 0) throw new Error("Thiết bị không tồn tại trong kho");
            
            const currentStock = equipResult.recordset[0].Quantity;
            const equipName = equipResult.recordset[0].Name;

            if (currentStock < requestQty) {
                throw new Error(`Kho không đủ hàng! '${equipName}' chỉ còn ${currentStock} (Yêu cầu: ${requestQty})`);
            }

            await transaction.request()
                .input('qty', sql.Int, requestQty)
                .input('eid', sql.Int, equipId)
                .query(`UPDATE Equipment SET Quantity = Quantity - @qty WHERE EquipmentID = @eid`);

            await transaction.request()
                .input('rid', sql.Int, requestId)
                .query(`UPDATE EquipmentRequest SET Status = 'Approved' WHERE RequestID = @rid`);

            await transaction.commit();
            return { success: true };

        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    }
}

module.exports = new AdminRepository();