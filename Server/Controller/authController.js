const { sql } = require('../Config/db');

// =========================================================
// 1. ĐĂNG NHẬP
// =========================================================
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Kiểm tra trong bảng Staff trước
        let result = await sql.query`SELECT * FROM Staff WHERE Email = ${email} OR Phone = ${email}`;
        let user = result.recordset[0];
        let role = '';

        if (!user) {
            // Nếu không phải Staff, kiểm tra Patient
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

        // Trả về thông tin user (loại bỏ mật khẩu)
        const { PasswordHash, ...userInfo } = user; 
        
        res.json({
            message: "Đăng nhập thành công!",
            user: {
                ...userInfo,
                role: role
            }
        });

    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ message: "Lỗi server khi đăng nhập" });
    }
};

// =========================================================
// 2. KIỂM TRA TỒN TẠI (CHO BƯỚC 1)
// =========================================================
exports.checkExistence = async (req, res) => {
    const { email, phone } = req.body;

    try {
        // Kiểm tra Email có tồn tại trong Patient hoặc Staff không
        if (email) {
            const checkEmail = await sql.query`
                SELECT Email FROM Patient WHERE Email = ${email}
                UNION
                SELECT Email FROM Staff WHERE Email = ${email}
            `;
            if (checkEmail.recordset.length > 0) {
                return res.status(400).json({ message: "Email này đã được sử dụng!" });
            }
        }

        // Kiểm tra SĐT có tồn tại trong Patient hoặc Staff không
        if (phone) {
            const checkPhone = await sql.query`
                SELECT Phone FROM Patient WHERE Phone = ${phone}
                UNION
                SELECT Phone FROM Staff WHERE Phone = ${phone}
            `;
            if (checkPhone.recordset.length > 0) {
                return res.status(400).json({ message: "Số điện thoại này đã được đăng ký!" });
            }
        }

        res.status(200).json({ message: "Thông tin hợp lệ" });

    } catch (err) {
        console.error("Check Existence Error:", err);
        res.status(500).json({ message: "Lỗi server khi kiểm tra thông tin" });
    }
};

// =========================================================
// 3. ĐĂNG KÝ TÀI KHOẢN (CHO BƯỚC 2 - FULL FLOW)
// =========================================================
exports.register = async (req, res) => {
    // Nhận tất cả dữ liệu từ Frontend gửi lên
    const { 
        fullName, phone, email, password,
        dob, gender, address,
        insuranceId, bloodGroup, allergies, medicalHistory, 
        relativeName, relativePhone, relationship 
    } = req.body;

    // --- Validate Server-side ---
    
    // 1. Kiểm tra trường bắt buộc cơ bản
    if (!fullName || !phone || !email || !password || !insuranceId) {
        return res.status(400).json({ message: "Thiếu thông tin bắt buộc!" });
    }

    // 2. Kiểm tra logic nghiệp vụ: SĐT người thân không trùng SĐT bản thân
    if (phone.trim() === relativePhone.trim()) {
        return res.status(400).json({ message: "SĐT người thân không được trùng với SĐT đăng ký!" });
    }

    try {
        // 3. Kiểm tra lại trùng lặp Email/Phone (Double check để bảo mật)
        const checkUser = await sql.query`
            SELECT Phone FROM Patient WHERE Phone = ${phone} OR Email = ${email}
            UNION
            SELECT Phone FROM Staff WHERE Phone = ${phone} OR Email = ${email}
        `;

        if (checkUser.recordset.length > 0) {
            return res.status(400).json({ message: "Email hoặc Số điện thoại đã tồn tại trong hệ thống!" });
        }

        // 4. Kiểm tra trùng mã BHYT (InsuranceID)
        const checkInsurance = await sql.query`
            SELECT InsuranceID FROM Patient WHERE InsuranceID = ${insuranceId}
        `;
        if (checkInsurance.recordset.length > 0) {
            return res.status(400).json({ message: "Mã BHYT này đã được sử dụng bởi bệnh nhân khác!" });
        }

        // 5. Thực hiện INSERT vào Database
        await sql.query`
            INSERT INTO Patient (
                FullName, Phone, Email, PasswordHash, 
                DoB, Gender, Address,
                InsuranceID, BloodGroup, Allergies, MedicalHistory,
                RelativeName, RelativePhone, Relationship
            )
            VALUES (
                ${fullName}, ${phone}, ${email}, ${password},
                ${dob}, ${gender}, ${address},
                ${insuranceId}, ${bloodGroup}, ${allergies}, ${medicalHistory},
                ${relativeName}, ${relativePhone}, ${relationship}
            )
        `;

        res.json({ message: "Đăng ký thành công! Vui lòng đăng nhập." });

    } catch (err) {
        console.error("Register Error:", err);
        res.status(500).json({ message: "Lỗi server khi tạo tài khoản" });
    }
};