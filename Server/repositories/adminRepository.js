const { sql, poolPromise } = require('../config/db.config');

class AdminRepository {
    async getAllStaff() {
        const pool = await poolPromise;
        const result = await pool.request().query(`SELECT S.*, U.Username, U.Email, U.Role FROM Staff S JOIN Users U ON S.UserID = U.UserID`);
        return result.recordset;
    }

    async createStaff(userData, staffData) {
        const pool = await poolPromise;
        const transaction = new sql.Transaction(pool);
        try {
            await transaction.begin();
            const userResult = await transaction.request()
                .input('u', sql.VarChar, userData.username).input('p', sql.VarChar, userData.password)
                .input('e', sql.VarChar, userData.email).input('r', sql.NVarChar, userData.role)
                .query(`INSERT INTO Users (Username, PasswordHash, Email, Role) OUTPUT INSERTED.UserID VALUES (@u, @p, @e, @r)`);
            const newUserId = userResult.recordset[0].UserID;

            await transaction.request()
                .input('uid', sql.Int, newUserId).input('fn', sql.NVarChar, staffData.fullName)
                .input('dep', sql.NVarChar, staffData.department).input('spec', sql.NVarChar, staffData.specialization).input('ph', sql.VarChar, staffData.phone)
                .query(`INSERT INTO Staff (UserID, FullName, Department, Specialization, Phone) VALUES (@uid, @fn, @dep, @spec, @ph)`);
            await transaction.commit();
            return { userId: newUserId };
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    }
}
module.exports = new AdminRepository();