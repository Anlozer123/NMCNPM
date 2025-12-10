const { sql } = require('../Config/db');

// Hàm xử lý Đăng nhập
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Kiểm tra trong bảng Staff (Bác sĩ, Y tá, Admin)
        // Dùng email hoặc số điện thoại để đăng nhập đều được
        let result = await sql.query`SELECT * FROM Staff WHERE Email = ${email} OR Phone = ${email}`;
        
        let user = result.recordset[0];
        let role = '';

        // Nếu không tìm thấy trong Staff, tìm tiếp trong bảng Patient
        if (!user) {
            result = await sql.query`SELECT * FROM Patient WHERE Phone = ${email}`; // Bệnh nhân thường dùng SĐT
            user = result.recordset[0];
            if (user) role = 'Patient';
        } else {
            role = user.Role; // Lấy role từ bảng Staff (Doctor/Nurse/Admin)
        }

        // Kiểm tra kết quả
        if (!user) {
            return res.status(401).json({ message: "Tài khoản không tồn tại!" });
        }

        // Kiểm tra mật khẩu
        if (user.PasswordHash !== password) {
            return res.status(401).json({ message: "Sai mật khẩu!" });
        }

        // Trả về thông tin người dùng (ẩn mật khẩu đi)
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

exports.register = async (req, res) => {
    const { fullName, phone, email, dob, gender, address, password } = req.body;

    try {
        // Kiểm tra xem SĐT đã tồn tại chưa (trong cả bảng Patient và Staff)
        const checkPatient = await sql.query`SELECT * FROM Patient WHERE Phone = ${phone}`;
        const checkStaff = await sql.query`SELECT * FROM Staff WHERE Phone = ${phone}`;

        if (checkPatient.recordset.length > 0 || checkStaff.recordset.length > 0) {
            return res.status(400).json({ message: "Số điện thoại này đã được đăng ký!" });
        }

        // Thêm mới Bệnh nhân 
        await sql.query`
            INSERT INTO Patient (FullName, Phone, Email, DoB, Gender, Address, PasswordHash)
            VALUES (${fullName}, ${phone}, ${email}, ${dob}, ${gender}, ${address}, ${password})
        `;

        res.json({ message: "Đăng ký thành công! Vui lòng đăng nhập." });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi server khi đăng ký" });
    }
};