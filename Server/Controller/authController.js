const { sql } = require('../Config/db');

// Hàm xử lý Đăng nhập
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Kiểm tra trong bảng Staff (Bác sĩ, Y tá, Admin)
        // Lưu ý: Dùng email hoặc số điện thoại để đăng nhập đều được
        let result = await sql.query`SELECT * FROM Staff WHERE Email = ${email} OR Phone = ${email}`;
        
        let user = result.recordset[0];
        let role = '';

        // 2. Nếu không tìm thấy trong Staff, tìm tiếp trong bảng Patient
        if (!user) {
            result = await sql.query`SELECT * FROM Patient WHERE Phone = ${email}`; // Bệnh nhân thường dùng SĐT
            user = result.recordset[0];
            if (user) role = 'Patient';
        } else {
            role = user.Role; // Lấy role từ bảng Staff (Doctor/Nurse/Admin)
        }

        // 3. Kiểm tra kết quả
        if (!user) {
            return res.status(401).json({ message: "Tài khoản không tồn tại!" });
        }

        // 4. Kiểm tra mật khẩu
        // Lưu ý: Ở đây đang so sánh text thô để khớp với dữ liệu mẫu. 
        // Trong thực tế sản phẩm (Sprint 4), bạn cần dùng bcrypt.compare()
        if (user.PasswordHash !== password) {
            return res.status(401).json({ message: "Sai mật khẩu!" });
        }

        // 5. Trả về thông tin người dùng (ẩn mật khẩu đi)
        const { PasswordHash, ...userInfo } = user; // Loại bỏ field PasswordHash
        
        res.json({
            message: "Đăng nhập thành công!",
            user: {
                ...userInfo,
                role: role 
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi server" });
    }
};