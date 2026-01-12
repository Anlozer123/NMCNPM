const fs = require('fs');
const path = require('path');
const { sql, connectDB } = require('./Config/db'); 

async function resetDatabase() {
    try {
        console.log("⏳ Đang kết nối Database...");
        const pool = await connectDB();

        // XÓA CÁC BẢNG CŨ 
        console.log("🔥 Đang xóa dữ liệu cũ...");
        const dropQuery = `
            -- Tắt ràng buộc khóa ngoại tạm thời
            EXEC sp_msforeachtable "ALTER TABLE ? NOCHECK CONSTRAINT all";
            
            -- Xóa các bảng (Thứ tự quan trọng: bảng con xóa trước)
            DROP TABLE IF EXISTS EquipmentRequest;
            DROP TABLE IF EXISTS PrescriptionItem;
            DROP TABLE IF EXISTS Prescription;
            DROP TABLE IF EXISTS MedicalRecord;
            DROP TABLE IF EXISTS Appointment;
            DROP TABLE IF EXISTS Schedule;
            DROP TABLE IF EXISTS Staff;
            DROP TABLE IF EXISTS Patient;
            DROP TABLE IF EXISTS Medicine;
            DROP TABLE IF EXISTS Equipment;
        `;
        await pool.request().query(dropQuery);

        // VÀ CHẠY FILE SCHEMA.SQL 
        console.log("🏗️  Đang tạo bảng mới từ schema.sql...");
        const schemaPath = path.join(__dirname, '../Database/schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        
        // Tách lệnh bằng từ khóa GO (vì Node.js không hiểu GO)
        const schemaCommands = schemaSql.split('GO');
        for (const command of schemaCommands) {
            if (command.trim()) {
                // Bỏ qua các lệnh tạo DB 
                if (!command.includes('CREATE DATABASE') && !command.includes('USE HospitalManagement')) {
                    await pool.request().query(command);
                }
            }
        }

        // ĐỌC VÀ CHẠY FILE SEED.SQL 
        console.log("🌱 Đang nạp dữ liệu mẫu từ seed.sql...");
        const seedPath = path.join(__dirname, '../Database/sample_1.sql');
        const seedSql = fs.readFileSync(seedPath, 'utf8');
        
        const seedCommands = seedSql.split('GO');
        for (const command of seedCommands) {
            if (command.trim()) {
                if (!command.includes('USE HospitalManagement')) {
                    await pool.request().query(command);
                }
            }
        }

        console.log(" THÀNH CÔNG! Database đã được làm mới hoàn toàn.");
        process.exit(0);

    } catch (err) {
        console.error(" LỖI:", err);
        process.exit(1);
    }
}

resetDatabase();