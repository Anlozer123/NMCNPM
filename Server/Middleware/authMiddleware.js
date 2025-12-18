const jwt = require('jsonwebtoken');

// ⚠️ Cần thay thế bằng Khóa bí mật thực tế của bạn, 
// nên lưu trữ trong file .env
const JWT_SECRET = 'YOUR_SECRET_KEY_GOES_HERE_12345'; 

/**
 * Middleware xác minh Token JWT
 * @param {object} req - Đối tượng Request
 * @param {object} res - Đối tượng Response
 * @param {function} next - Chức năng gọi Middleware hoặc Controller tiếp theo
 */
exports.verifyToken = (req, res, next) => {
    // 1. Lấy token từ header Authorization (thường có định dạng: Bearer <token>)
    const authHeader = req.headers['authorization'];
    
    // Kiểm tra xem header có tồn tại và đúng định dạng không
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // 
        return res.status(401).json({ message: 'Truy cập bị từ chối. Không tìm thấy token.' });
    }

    // Lấy chuỗi token thực tế
    const token = authHeader.split(' ')[1];

    try {
        // 2. Giải mã và xác minh token
        // Token chứa StaffID, FullName, Role, v.v.
        const decoded = jwt.verify(token, JWT_SECRET);

        // 3. Gắn thông tin người dùng vào req.user (Sử dụng cho Controller)
        // Đây là bước quan trọng giúp DoctorController lấy được req.user.StaffID
        req.user = decoded; 
        
        // 4. Tiếp tục chạy Controller hoặc Middleware tiếp theo
        next(); 

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token đã hết hạn.' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Token không hợp lệ.' });
        }
        console.error("Lỗi xác thực token:", error);
        return res.status(500).json({ message: 'Lỗi Server trong quá trình xác thực.' });
    }
};

/**
 * Middleware kiểm tra vai trò (chỉ dành cho Bác sĩ)
 * (Tùy chọn, nếu bạn muốn chặn Y tá hoặc Admin truy cập các route Bác sĩ)
 */
exports.isDoctor = (req, res, next) => {
    // Yêu cầu middleware verifyToken phải chạy trước
    if (req.user && req.user.Role === 'Doctor') {
        next();
    } else {
        res.status(403).json({ message: 'Bạn không có quyền truy cập chức năng này (Chỉ dành cho Bác sĩ).' });
    }
};