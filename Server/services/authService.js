const authRepository = require('../repositories/authRepository');

class AuthService {
    async login(username, password) {
        // 1. Tìm user trong bảng Users
        const user = await authRepository.findUserByUsername(username);
        
        if (!user) {
            throw new Error('Tài khoản không tồn tại (User not found)');
        }

        // 2. So sánh mật khẩu (Plain text như trong database seed)
        // Lưu ý: Nếu database bạn đã hash thì dùng bcrypt.compare
        if (user.PasswordHash !== password) {
            throw new Error('Sai mật khẩu (Invalid password)');
        }

        // 3. Lấy thông tin chi tiết (Tên, StaffID/PatientID...)
        const details = await authRepository.getRoleDetails(user.UserID, user.Role);

        // [FIX LỖI QUAN TRỌNG] Nếu là Staff/Admin mà chưa có trong bảng Staff
        if (!details && user.Role !== 'Admin') { 
            // Nếu là Admin có thể châm chước trả về thông tin User gốc
            // Nhưng tốt nhất là dữ liệu phải chuẩn.
            throw new Error('Tài khoản hợp lệ nhưng chưa có hồ sơ nhân viên/bệnh nhân. Vui lòng liên hệ IT.');
        }

        // 4. Trả về dữ liệu đã gộp
        return {
            account: {
                UserID: user.UserID,
                Username: user.Username,
                Email: user.Email,
                Role: user.Role
            },
            details: details || {} // Trả về rỗng nếu không tìm thấy (để tránh crash frontend)
        };
    }

    async register(data) {
        return await authRepository.createUser(data);
    }
}
module.exports = new AuthService();