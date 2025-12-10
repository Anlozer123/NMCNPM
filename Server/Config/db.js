const sql = require('mssql');
require('dotenv').config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER, 
    database: process.env.DB_NAME,
    options: {
        encrypt: true, // Bắt buộc nếu dùng Azure, local có thể để false
        trustServerCertificate: true // Bắt buộc true nếu chạy local (bỏ qua SSL)
    }
};

const connectDB = async () => {
    try {
        let pool = await sql.connect(config);
        console.log("✅ Kết nối SQL Server thành công!");
        return pool;
    } catch (err) {
        console.error("❌ Lỗi kết nối SQL Server:", err);
    }
};

module.exports = { connectDB, sql };