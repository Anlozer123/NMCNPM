const { sql } = require('../Config/db');

const isValidPhone = (phone) => {
    // Regex: Bắt buộc 10 ký tự số
    return /^\d{10}$/.test(phone);
};

// Lấy thông tin Profile của Admin (Rút gọn)
exports.getAdminProfile = async (req, res) => {
    const { id } = req.query; 
    try {
        // CHỈ LẤY: ID, Tên, Ngày sinh, SĐT, Email, Role
        const result = await sql.query`
            SELECT 
                StaffID, 
                FullName, 
                DoB, 
                Phone, 
                Email, 
                Role 
            FROM Staff 
            WHERE StaffID = ${id}
        `;
        
        if (result.recordset.length > 0) {
            res.json(result.recordset[0]);
        } else {
            res.status(404).json({ message: "Không tìm thấy quản trị viên" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Lấy danh sách lịch làm việc (Kèm thông tin nhân viên)
exports.getWorkSchedule = async (req, res) => {
    try {
        // Lấy tất cả lịch, join với bảng Staff để lấy tên và chức vụ
        const result = await sql.query`
            SELECT 
                WS.ScheduleID,
                WS.WorkDate,
                WS.ShiftType,
                S.StaffID,
                S.FullName,
                S.Role,
                S.Specialization
            FROM WorkSchedule WS
            JOIN Staff S ON WS.StaffID = S.StaffID
            ORDER BY S.StaffID, WS.WorkDate
        `;

        // Lấy danh sách nhân viên (Chỉ bác sĩ và y tá)
        const staffResult = await sql.query`
            SELECT StaffID, FullName, Role, Specialization 
            FROM Staff 
            WHERE Role IN ('Doctor', 'Nurse')
            ORDER BY Role, FullName
        `;

        res.json({
            schedule: result.recordset,
            staff: staffResult.recordset
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
//Lấy danh sách tất cả bệnh nhân
exports.getAllPatients = async (req, res) => {
    try {
        const result = await sql.query`
            SELECT 
                P.PatientID, 
                P.FullName, 
                P.Gender, 
                P.DoB, 
                P.Phone, 
                P.Address, 
                P.CurrentRoom, 
                P.Email,
                P.NurseID,
                DATEDIFF(year, P.DoB, GETDATE()) AS Age
            FROM Patient P
            ORDER BY P.FullName ASC
        `;
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Thêm bệnh nhân mới
exports.addPatient = async (req, res) => {
    const { fullName, gender, dob, phone, address } = req.body;

    if (!isValidPhone(phone)) {
        return res.status(400).json({ success: false, message: "Số điện thoại phải bao gồm đúng 10 chữ số!" });
    }

    try {
        await sql.query`
            INSERT INTO Patient (FullName, Gender, DoB, Phone, Address, PasswordHash)
            VALUES (${fullName}, ${gender}, ${dob}, ${phone}, ${address}, '123456')
        `;
        res.json({ success: true, message: "Thêm bệnh nhân thành công!" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Cập nhật thông tin bệnh nhân
exports.updatePatient = async (req, res) => {
    const { id } = req.params; // Lấy ID từ URL
    // Lấy dữ liệu gửi lên từ Frontend
    const { fullName, gender, dob, phone, address, email, password, currentRoom, nurseId } = req.body;
    
    if (phone && !isValidPhone(phone)) 
    {
        return res.status(400).json({ success: false, message: "Số điện thoại phải bao gồm đúng 10 chữ số!" });
    }

    try {
        let query = `
            UPDATE Patient 
            SET 
                FullName = N'${fullName}', 
                Gender = '${gender}', 
                DoB = '${dob}', 
                Phone = '${phone}', 
                Address = N'${address}',
                Email = '${email}',
                CurrentRoom = ${currentRoom ? `'${currentRoom}'` : 'NULL'}, 
                NurseID = ${nurseId ? nurseId : 'NULL'}
        `;

        if (password && password.trim() !== '') {
            query += `, PasswordHash = '${password}' `;
        }

        query += ` WHERE PatientID = ${id}`;

        await sql.query(query);

        res.json({ success: true, message: "Cập nhật thành công!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
};

// Lấy danh sách toàn bộ nhân viên
exports.getAllStaff = async (req, res) => {
    try {
        // Truy vấn lấy tất cả nhân viên (Bác sĩ và Y tá)
        // Lưu ý: Cần lấy đủ các cột để hiển thị bên React
        const result = await sql.query`
            SELECT 
                StaffID, 
                FullName, 
                Role,           
                Specialization,
                Phone, 
                Email 
            FROM Staff 
            WHERE Role IN ('Doctor', 'Nurse')
            ORDER BY Role, FullName
        `;
        
        res.json(result.recordset);
    } catch (err) {
        console.error("Lỗi lấy danh sách nhân viên:", err);
        res.status(500).json({ error: err.message });
    }
};

// --- THÊM MỚI NHÂN VIÊN ---
exports.addStaff = async (req, res) => {
    const { fullName, role, specialization, phone, email, password } = req.body;

    if (!isValidPhone(phone)) {
        return res.status(400).json({ success: false, message: "Số điện thoại phải bao gồm đúng 10 chữ số!" });
    }

    try {
        await sql.query`
            INSERT INTO Staff (FullName, Role, Specialization, Phone, Email, PasswordHash)
            VALUES (
                N${fullName}, 
                ${role}, 
                N${specialization}, 
                ${phone}, 
                ${email}, 
                ${password || '123456'} -- Mật khẩu mặc định nếu không nhập
            )
        `;
        res.json({ success: true, message: "Thêm nhân viên thành công!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
};

// --- CẬP NHẬT NHÂN VIÊN ---
exports.updateStaff = async (req, res) => {
    const { id } = req.params;
    const { fullName, role, specialization, phone, email, password } = req.body;

    if (phone && !isValidPhone(phone)) {
        return res.status(400).json({ success: false, message: "Số điện thoại phải bao gồm đúng 10 chữ số!" });
    }

    try {
        // Tạo câu query cơ bản
        let query = `
            UPDATE Staff
            SET 
                FullName = N'${fullName}',
                Role = '${role}',
                Specialization = N'${specialization}',
                Phone = '${phone}',
                Email = '${email}'
        `;

        // Nếu có nhập mật khẩu mới thì mới update, không thì giữ nguyên
        if (password && password.trim() !== '') {
            query += `, PasswordHash = '${password}' `;
        }

        query += ` WHERE StaffID = ${id}`;

        await sql.query(query);
        res.json({ success: true, message: "Cập nhật nhân viên thành công!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.getDashboardStats = async (req, res) => {
    try {
        const patients = await sql.query`SELECT COUNT(*) AS count FROM Patient`;
        const doctors = await sql.query`SELECT COUNT(*) AS count FROM Staff WHERE Role = 'Doctor'`;
        const nurses = await sql.query`SELECT COUNT(*) AS count FROM Staff WHERE Role = 'Nurse'`;
        // Giả sử chưa có bảng Appointment thì trả về 0
        // const appointments = await sql.query`SELECT COUNT(*) AS count FROM Appointment WHERE CAST(AppointmentDate AS DATE) = CAST(GETDATE() AS DATE)`;
        const requests = await sql.query`SELECT COUNT(*) AS count FROM PatientRequest WHERE Status = 'Pending'`;

        res.json({
            patientCount: patients.recordset[0].count,
            doctorCount: doctors.recordset[0].count,
            nurseCount: nurses.recordset[0].count,
            appointmentCount: 0, // Tạm thời để 0 nếu chưa có bảng
            requestCount: requests.recordset[0].count
        });
    } catch (err) {
        console.error(err);
        res.json({ patientCount: 0, doctorCount: 0, nurseCount: 0, appointmentCount: 0, requestCount: 0 });
    }
};