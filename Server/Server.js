const express = require('express');
const cors = require('cors');
const doctorRoutes = require('./Routes/doctorRoutes');
const nurseRoutes = require('./Routes/nurseRoutes');
const adminRoutes = require('./Routes/adminRoutes');
const patientRoutes = require('./Routes/patientRoutes');
const authRoutes = require('./Routes/authRoutes'); 
const aiRoutes = require('./Routes/aiRoutes'); // Import đã có

const { connectDB, sql } = require('./Config/db'); 
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); 
app.use(express.json()); 

// Kết nối Database
connectDB();

// --- Đăng ký các API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/nurse', nurseRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/patient', patientRoutes);

// --- QUAN TRỌNG: Kích hoạt API AI Tóm tắt ---
app.use('/api/ai', aiRoutes); // Thêm dòng này để sửa lỗi 404

// Route Test thử dữ liệu
app.get('/api/test-users', async (req, res) => {
    try {
        const result = await sql.query`SELECT * FROM Staff`;
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Khởi động Server
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});