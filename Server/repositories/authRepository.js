const { sql, poolPromise } = require('../config/db.config');

class AuthRepository {
    async findUserByUsername(username) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('username', sql.VarChar, username)
            .query(`SELECT * FROM Users WHERE Username = @username`);
        return result.recordset[0];
    }

    async getRoleDetails(userId, role) {
        const pool = await poolPromise;
        let query = '';
        
        if (role === 'Patient') {
            query = `SELECT * FROM Patients WHERE UserID = @userId`;
        } else {
            // Bao gồm cả Admin, Doctor, Nurse -> Tìm trong bảng Staff
            query = `SELECT * FROM Staff WHERE UserID = @userId`;
        }
        
        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query(query);
            
        return result.recordset[0];
    }

    async createUser(userData) {
        // (Giữ nguyên phần register cũ của bạn hoặc copy lại từ các phản hồi trước)
        // Phần này không ảnh hưởng đến lỗi đăng nhập hiện tại.
        const pool = await poolPromise;
        const transaction = new sql.Transaction(pool);
        try {
            await transaction.begin();
            
            const userResult = await transaction.request()
                .input('u', sql.VarChar, userData.username)
                .input('p', sql.VarChar, userData.password)
                .input('e', sql.VarChar, userData.email)
                .input('r', sql.NVarChar, 'Patient')
                .query(`INSERT INTO Users (Username, PasswordHash, Email, Role) OUTPUT INSERTED.UserID VALUES (@u, @p, @e, @r)`);
            
            const newUserId = userResult.recordset[0].UserID;

            await transaction.request()
                .input('uid', sql.Int, newUserId)
                .input('fn', sql.NVarChar, userData.fullName)
                .input('ph', sql.VarChar, userData.phone)
                .input('dob', sql.Date, userData.dob)
                .input('gen', sql.NVarChar, userData.gender)
                .input('addr', sql.NVarChar, userData.address)
                .query(`INSERT INTO Patients (UserID, FullName, Phone, DoB, Gender, Address) VALUES (@uid, @fn, @ph, @dob, @gen, @addr)`);

            await transaction.commit();
            return { userId: newUserId, role: 'Patient' };
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    }
}
module.exports = new AuthRepository();