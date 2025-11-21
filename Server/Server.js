const express = require('express');
const cors = require('cors');
// Lưu ý: Hãy đảm bảo tên thư mục là 'Config' hay 'config' để khớp với máy bạn
const { connectDB, sql } = require('./Config/db'); 
require('dotenv').config();

// --- 1. THÊM MỚI: Import Routes Authentication ---
const authRoutes = require('./Routes/authRoutes'); 
// -------------------------------------------------

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Cho phép Client gọi API
app.use(express.json()); // Cho phép đọc JSON từ body request

// Kết nối Database
connectDB();

// --- 2. THÊM MỚI: Kích hoạt API Đăng nhập ---
// Khi người dùng gọi vào /api/auth/login -> nó sẽ chạy vào authRoutes
app.use('/api/auth', authRoutes);
// --------------------------------------------

// --- Route Test thử dữ liệu (Có thể xóa sau này) ---
app.get('/api/test-users', async (req, res) => {
    try {
        // Query thử danh sách Staff từ DB mà ta đã Seed
        const result = await sql.query`SELECT * FROM Staff`;
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Khởi động Server
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});