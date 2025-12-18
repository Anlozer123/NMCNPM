const { sql } = require('../Config/db');
const bcrypt = require('bcryptjs'); // Thêm dòng này

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Tìm user trong Staff hoặc Patient
        let result = await sql.query`SELECT * FROM Staff WHERE Email = ${email} OR Phone = ${email}`;
        let user = result.recordset[0];
        let role = user ? user.Role : '';

        if (!user) {
            result = await sql.query`SELECT * FROM Patient WHERE Email = ${email} OR Phone = ${email}`;
            user = result.recordset[0];
            if (user) role = 'Patient';
        }

        if (!user) {
            return res.status(401).json({ message: "Tài khoản không tồn tại!" });
        }

        // --- SỬA LỖI Ở ĐÂY ---
        // Sử dụng bcrypt.compare để so sánh mật khẩu nhập vào với mật khẩu đã mã hóa trong DB
        const isMatch = await bcrypt.compare(password, user.PasswordHash.trim());
        
        if (!isMatch) {
            return res.status(401).json({ message: "Sai mật khẩu!" });
        }

        const { PasswordHash, ...userInfo } = user;
        res.json({
            message: "Đăng nhập thành công!",
            user: { ...userInfo, role: role }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi server" });
    }
};

exports.register = async (req, res) => {
    const { fullName, phone, email, dob, gender, address, password } = req.body;

    try {
        // 1. Kiểm tra SĐT tồn tại (Giữ nguyên logic của bạn)
        const checkPatient = await sql.query`SELECT * FROM Patient WHERE Phone = ${phone}`;
        if (checkPatient.recordset.length > 0) {
            return res.status(400).json({ message: "Số điện thoại này đã được đăng ký!" });
        }

        // 2. MÃ HÓA MẬT KHẨU TRƯỚC KHI LƯU
        const SALT_ROUNDS = 10;
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        // 3. Thêm mới Bệnh nhân với mật khẩu ĐÃ MÃ HÓA
        await sql.query`
            INSERT INTO Patient (FullName, Phone, Email, DoB, Gender, Address, PasswordHash)
            VALUES (${fullName}, ${phone}, ${email}, ${dob}, ${gender}, ${address}, ${hashedPassword})
        `;

        res.json({ message: "Đăng ký thành công! Vui lòng đăng nhập." });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi server khi đăng ký" });
    }
};