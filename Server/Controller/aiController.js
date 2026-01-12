const aiService = require('../Service/aiService');
const { sql } = require('../Config/db'); 

// 1. Hàm Tóm tắt: Tự động lấy dữ liệu từ DB để gửi cho AI
exports.summarizeMedicalRecord = async (req, res) => {
    try {
        const { patientId } = req.body; 

        if (!patientId) {
            return res.status(400).json({ success: false, message: "Thiếu ID bệnh nhân." });
        }

        if (!sql) throw new Error("Chưa kết nối SQL Server.");

        // A. Lấy thông tin cá nhân từ bảng Patient
        const patientRes = await sql.query`SELECT * FROM Patient WHERE PatientID = ${patientId}`;
        const patient = patientRes.recordset[0];

        if (!patient) {
            return res.status(404).json({ success: false, message: "Không tìm thấy bệnh nhân trong CSDL." });
        }

        // B. Lấy bệnh án gần nhất từ MedicalRecord (Sắp xếp theo ngày mới nhất)
        const recordRes = await sql.query`
            SELECT TOP 1 Diagnosis, Notes, Date 
            FROM MedicalRecord 
            WHERE PatientID = ${patientId} 
            ORDER BY Date DESC
        `;
        const lastRecord = recordRes.recordset[0] || {};

        // C. Lấy thuốc từ lần khám gần nhất (Prescription JOIN Medicine)
        // Lưu ý: Chỉ lấy thuốc nếu có đơn thuốc (RecordID khớp với lần khám cuối)
        let medicationsText = "Chưa có đơn thuốc.";
        if (lastRecord.Diagnosis) {
             const medRes = await sql.query`
                SELECT M.Name, PI.Dosage 
                FROM Prescription P
                JOIN PrescriptionItem PI ON P.PrescriptionID = PI.PrescriptionID
                JOIN Medicine M ON PI.MedicineID = M.MedicineID
                JOIN MedicalRecord MR ON P.RecordID = MR.RecordID
                WHERE MR.PatientID = ${patientId}
            `;
            // Gộp danh sách thuốc thành chuỗi
            if (medRes.recordset.length > 0) {
                medicationsText = medRes.recordset.map(m => `${m.Name} (${m.Dosage})`).join(", ");
            }
        }

        // D. Tổng hợp dữ liệu thành một đoạn văn bản chi tiết cho AI
        const fullMedicalText = `
            Hồ sơ bệnh nhân: ${patient.FullName} (Giới tính: ${patient.Gender}).
            Tiền sử bệnh: ${patient.MedicalHistory || "Không ghi nhận"}.
            Dị ứng: ${patient.Allergies || "Không"}.
            Tình trạng hiện tại: ${patient.CurrentCondition || "Bình thường"}.
            
            Thông tin khám gần nhất (${lastRecord.Date ? new Date(lastRecord.Date).toLocaleDateString() : 'N/A'}):
            - Chẩn đoán của bác sĩ: ${lastRecord.Diagnosis || "Chưa có chẩn đoán"}.
            - Ghi chú chuyên môn: ${lastRecord.Notes || "Không có ghi chú"}.
            - Đơn thuốc chỉ định: ${medicationsText}.
        `;

        console.log("📝 Dữ liệu gửi AI:", fullMedicalText); // Log để kiểm tra server

        // E. Gọi Service AI
        const summaryResult = await aiService.generateSummary(fullMedicalText);

        return res.status(200).json({ success: true, summary: summaryResult });

    } catch (error) {
        console.error("Lỗi Controller:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Hàm Lấy danh sách: Lọc theo Bác sĩ phụ trách
exports.getPatientList = async (req, res) => {
    try {
        const { doctorId } = req.query; // Lấy ID bác sĩ từ URL (?doctorId=2)

        if (!sql) throw new Error("Chưa kết nối SQL Server.");

        let result;
        
        // Nếu có doctorId -> Chỉ lấy bệnh nhân có hẹn (Appointment) với bác sĩ này
        if (doctorId) {
            result = await sql.query`
                SELECT DISTINCT P.PatientID, P.FullName, P.Gender, P.MedicalHistory
                FROM Patient P
                JOIN Appointment A ON P.PatientID = A.PatientID
                WHERE A.DoctorID = ${doctorId}
            `;
        } else {
            // Nếu không có ID (ví dụ Admin), lấy 20 bệnh nhân đầu
            result = await sql.query`SELECT TOP 20 PatientID, FullName, Gender FROM Patient`;
        }
        
        res.status(200).json({ success: true, patients: result.recordset });
    } catch (error) {
        console.error("Lỗi lấy danh sách:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};