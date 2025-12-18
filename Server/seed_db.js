// server/seed_db.js (Phiên bản Đã sửa lỗi Cú pháp WHERE IN)

const { connectDB, sql } = require('./Config/db'); 
const bcrypt = require('bcryptjs'); 
const SALT_ROUNDS = 10; 
const DEFAULT_PASSWORD = '123456';

async function seedDatabase() {
    let pool; 
    try {
        console.log("--- Bắt đầu quy trình Seed Database (Mã hóa và Cập nhật Mật khẩu) ---");

        // 💡 BƯỚC 1: KẾT NỐI DB VÀ MÃ HÓA
        console.log("[DB] Đang kết nối đến Database...");
        pool = await connectDB(); 
        if (!pool) {
            console.error("❌ Kết nối thất bại, không thể tiếp tục.");
            return;
        }
        console.log("[DB] Kết nối thành công.");

        const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, SALT_ROUNDS);
        console.log(`[Bcrypt] Mật khẩu '123456' đã được mã hóa thành: ${hashedPassword}`);

        // --- KHẮC PHỤC LỖI WHERE IN ---
        
        // Tạo chuỗi giá trị IN an toàn, đảm bảo mỗi giá trị được bọc trong dấu nháy đơn
        // Ví dụ: "'admin@hms.com','doctor@hms.com','nurse@hms.com'"
        const staffEmails = ['admin@hms.com', 'doctor@hms.com', 'nurse@hms.com'];
        const patientPhones = ['0904444444', '0905555555']; 

        const staffInClause = staffEmails.map(val => `'${val}'`).join(',');
        const patientInClause = patientPhones.map(val => `'${val}'`).join(',');


        // 2. Cập nhật mật khẩu cho tất cả Staff
        // 💡 SỬ DỤNG CHUỖI TEMPLATE BÌNH THƯỜNG (không có tag 'sql') VÀ NỐI CHUỖI BÊN NGOÀI
        const staffUpdate = await pool.request().query(`
            UPDATE Staff
            SET PasswordHash = '${hashedPassword}'
            WHERE Email IN (${staffInClause}) OR Phone IN (${staffInClause})
        `);
        console.log(`[DB Success] Đã cập nhật ${staffUpdate.rowsAffected[0]} tài khoản Staff.`);

        // 3. Cập nhật mật khẩu cho tất cả Patient
        const patientUpdate = await pool.request().query(`
            UPDATE Patient
            SET PasswordHash = '${hashedPassword}'
            WHERE Phone IN (${patientInClause}) OR Email IN (${patientInClause})
        `);
        console.log(`[DB Success] Đã cập nhật ${patientUpdate.rowsAffected[0]} tài khoản Patient.`);

        console.log("--- Seed Database hoàn tất. Tài khoản test đã sẵn sàng đăng nhập. ---");

    } catch (err) {
        console.error("❌ LỖI trong quá trình Seed Database:", err);
    } finally {
        // Đóng kết nối
        if (pool) {
            pool.close();
            console.log("[DB] Đã đóng kết nối SQL.");
        }
    }
}

seedDatabase();