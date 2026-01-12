const { sql } = require('../Config/db'); 

// ============================================================
// UC010: CHỈ THỊ BÁC SĨ
// ============================================================

// Lấy danh sách Y lệnh (Chỉ lấy Pending)
exports.getDoctorInstructions = async (req, res) => {
    try {
        const result = await sql.query`
            SELECT 
                DoctorInstruction.*, 
                Patient.FullName AS PatientName, 
                Patient.Gender,
                Patient.CurrentRoom, 
                Staff.FullName AS DoctorName,
                Staff.Specialization 
            FROM DoctorInstruction 
            JOIN Patient ON DoctorInstruction.PatientID = Patient.PatientID
            JOIN Staff ON DoctorInstruction.DoctorID = Staff.StaffID
            WHERE DoctorInstruction.Status = 'Pending' 
            ORDER BY DoctorInstruction.CreatedAt ASC
        `;
        res.json(result.recordset);
    } catch (err) {
        console.error("Lỗi getDoctorInstructions:", err);
        res.status(500).json({ error: err.message });
    }
};

// Hoàn thành Y lệnh
exports.completeInstruction = async (req, res) => {
    const { instructionId } = req.body;
    try {
        await sql.query`UPDATE DoctorInstruction 
                        SET Status = 'Completed', CompletedAt = GETDATE() 
                        WHERE InstructionID = ${instructionId}`;
        res.json({ message: "Đã hoàn thành y lệnh!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ============================================================
// UC011: YÊU CẦU VẬT TƯ
// ============================================================

// Lấy danh sách thiết bị (Cho Dropdown)
exports.getEquipments = async (req, res) => {
    try {
        const result = await sql.query`SELECT * FROM Equipment`;
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Lấy lịch sử yêu cầu
exports.getEquipmentRequests = async (req, res) => {
    try {
        // SELECT rõ ràng các cột để tránh lỗi Ambiguous
        const result = await sql.query`
            SELECT 
                ER.RequestID,
                ER.Quantity,
                ER.Status,
                ER.RequestDate,
                ER.Reason,
                E.Name AS EquipmentName,
                P.FullName AS PatientName
            FROM EquipmentRequest ER
            JOIN Equipment E ON ER.EquipmentID = E.EquipmentID
            LEFT JOIN Patient P ON ER.PatientID = P.PatientID
            ORDER BY ER.RequestDate DESC
        `;
        res.json(result.recordset);
    } catch (err) {
        console.error("Lỗi getEquipmentRequests:", err);
        res.status(500).json({ error: err.message });
    }
};

// Gửi yêu cầu vật tư (Có check tồn kho)
exports.requestEquipment = async (req, res) => {
    const { itemId, quantity, urgency, reason, nurseId, patientId } = req.body;
    try {
        // 1. Kiểm tra tồn kho
        const stockCheck = await sql.query`SELECT Quantity FROM Equipment WHERE EquipmentID = ${itemId}`;
        
        if (stockCheck.recordset.length === 0) {
            return res.status(404).json({ error: "Thiết bị không tồn tại" });
        }

        const currentStock = stockCheck.recordset[0].Quantity;

        if (parseInt(quantity) > currentStock) {
            return res.status(400).json({ error: `Hết hàng! Kho chỉ còn ${currentStock} sản phẩm.` });
        }

        // 2. Insert
        await sql.query`
            INSERT INTO EquipmentRequest (StaffID, EquipmentID, Quantity, Urgency, Reason, Status, RequestDate, PatientID) 
            VALUES (${nurseId}, ${itemId}, ${quantity}, ${urgency}, ${reason}, 'Pending', GETDATE(), ${patientId})
        `;
        
        res.json({ message: "Đã gửi yêu cầu vật tư thành công!" });

    } catch (err) {
        console.error("Lỗi requestEquipment:", err);
        res.status(500).json({ error: err.message });
    }
};

// UC12: Lấy danh sách bệnh nhân do Y tá phụ trách
exports.getMyPatients = async (req, res) => {
    const { nurseId } = req.query; // Lấy ID từ URL param
    try {
        const result = await sql.query`
            SELECT 
                PatientID, 
                FullName, 
                Gender, 
                DoB, 
                Phone, 
                Address, 
                CurrentRoom,
                DATEDIFF(year, DoB, GETDATE()) AS Age -- Tính luôn tuổi
            FROM Patient 
            WHERE NurseID = ${nurseId}
        `;
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ============================================================
// UC013: YÊU CẦU TỪ BỆNH NHÂN
// ============================================================

// Lấy danh sách yêu cầu bệnh nhân
exports.getPatientRequests = async (req, res) => {
    try {
        const result = await sql.query`
            SELECT 
                PR.RequestID, 
                PR.Content, 
                PR.Status, 
                PR.CreatedAt,
                P.FullName AS PatientName,
                P.CurrentRoom
            FROM PatientRequest PR
            JOIN Patient P ON PR.PatientID = P.PatientID
            WHERE PR.Status IN ('Pending', 'Processing') 
            ORDER BY PR.CreatedAt ASC
        `;
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Xử lý yêu cầu (Nhập ghi chú và hoàn thành)
exports.handleRequest = async (req, res) => {
    const { requestId, status, note } = req.body; 
    try {
        await sql.query`
            UPDATE PatientRequest 
            SET Status = ${status}, 
                NurseNote = ${note}, 
                UpdatedAt = GETDATE() 
            WHERE RequestID = ${requestId}
        `;
        res.json({ message: "Đã xử lý yêu cầu thành công" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Trang chủ Y tá
exports.getNurseProfile = async (req, res) => {
    const { id } = req.query; // Lấy StaffID từ query param
    try {
        const result = await sql.query`
            SELECT StaffID, FullName, DoB, Phone, Email, Role 
            FROM Staff 
            WHERE StaffID = ${id}
        `;
        if (result.recordset.length > 0) {
            res.json(result.recordset[0]);
        } else {
            res.status(404).json({ message: "Không tìm thấy nhân viên" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};