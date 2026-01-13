const { sql } = require('../Config/db');

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        let result = await sql.query`SELECT * FROM Staff WHERE Email = ${email} OR Phone = ${email}`;
        
        let user = result.recordset[0];
        let role = '';

        if (!user) {
            result = await sql.query`SELECT * FROM Patient WHERE Email = ${email} OR Phone = ${email}`; 
            
            user = result.recordset[0];
            if (user) role = 'Patient';
        } else {
            role = user.Role; 
        }

        if (!user) {
            return res.status(401).json({ message: "Tài khoản không tồn tại!" });
        }

        if (user.PasswordHash !== password) {
            return res.status(401).json({ message: "Sai mật khẩu!" });
        }

        const { PasswordHash, ...userInfo } = user; 
        
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
        const checkPatient = await sql.query`SELECT * FROM Patient WHERE Phone = ${phone}`;
        const checkStaff = await sql.query`SELECT * FROM Staff WHERE Phone = ${phone}`;

        if (checkPatient.recordset.length > 0 || checkStaff.recordset.length > 0) {
            return res.status(400).json({ message: "Số điện thoại này đã được đăng ký!" });
        }

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