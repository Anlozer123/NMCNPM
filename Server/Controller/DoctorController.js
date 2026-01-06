const { sql } = require('../Config/db');

exports.getAppointments = async (req, res) => {
    const { doctorId } = req.params; // Lấy ID bác sĩ từ đường dẫn

    try {
        // Lấy tên bệnh nhân
        const result = await sql.query`
            SELECT 
                a.AppointmentID,
                a.PatientID, 
                a.AppointmentDate, 
                a.Status, 
                a.Reason, 
                p.FullName AS PatientName, 
                p.Gender
            FROM Appointment a
            JOIN Patient p ON a.PatientID = p.PatientID
            WHERE a.DoctorID = ${doctorId}
            ORDER BY a.AppointmentDate ASC
        `;

        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi lấy danh sách lịch khám" });
    }
};

// --- 2. Hàm Kê đơn thuốc (Mới thêm vào) ---
// Logic: Tạo Hồ sơ bệnh án -> Tạo Đơn thuốc -> Lưu chi tiết thuốc
exports.prescribeMedication = async (req, res) => {
    // Nhận dữ liệu từ Client gửi lên
    const { patientId, doctorId, diagnosis, notes, medications } = req.body;

    // Validate dữ liệu cơ bản
    if (!medications || medications.length === 0) {
        return res.status(400).json({ msg: "Vui lòng kê ít nhất một loại thuốc" });
    }

    // Sử dụng Transaction để đảm bảo an toàn dữ liệu (Lỗi 1 bước là hủy hết)
    const transaction = new sql.Transaction();
    
    try {
        await transaction.begin(); // Bắt đầu giao dịch

        // Bước A: Tạo Hồ sơ bệnh án (MedicalRecord)
        const recordRequest = new sql.Request(transaction);
        const recordResult = await recordRequest.query`
            INSERT INTO MedicalRecord (PatientID, DoctorID, Diagnosis, Notes, Date)
            OUTPUT INSERTED.RecordID
            VALUES (${patientId}, ${doctorId}, ${diagnosis}, ${notes}, GETDATE())
        `;
        const recordId = recordResult.recordset[0].RecordID;

        // Bước B: Tạo Đơn thuốc (Prescription) liên kết với Hồ sơ trên
        const prescriptionRequest = new sql.Request(transaction);
        const prescriptionResult = await prescriptionRequest.query`
            INSERT INTO Prescription (RecordID, CreatedDate)
            OUTPUT INSERTED.PrescriptionID
            VALUES (${recordId}, GETDATE())
        `;
        const prescriptionId = prescriptionResult.recordset[0].PrescriptionID;

        // Bước C: Lưu từng loại thuốc vào chi tiết đơn (PrescriptionItem)
        for (let item of medications) {
            const itemRequest = new sql.Request(transaction);
            // item.medicineId là ID thuốc chọn từ danh sách
            await itemRequest.query`
                INSERT INTO PrescriptionItem (PrescriptionID, MedicineID, Quantity, Dosage, Frequency, Duration, Note)
                VALUES (
                    ${prescriptionId}, 
                    ${item.medicineId}, 
                    ${item.quantity}, 
                    ${item.dosage}, 
                    ${item.frequency}, 
                    ${item.duration}, 
                    ${item.note}
                )
            `;
            
            // (Tuỳ chọn) Trừ kho thuốc tại đây nếu muốn
             const stockRequest = new sql.Request(transaction);
             await stockRequest.query`
                 UPDATE Medicine SET StockQuantity = StockQuantity - ${item.quantity} 
                 WHERE MedicineID = ${item.medicineId}
             `;
        }

        // Nếu tất cả thành công, lưu vào Database
        await transaction.commit();
        res.status(200).json({ msg: "Kê đơn thuốc thành công!", prescriptionId: prescriptionId });

    } catch (err) {
        // Nếu có lỗi bất kỳ đâu, hoàn tác tất cả (Rollback)
        await transaction.rollback();
        console.error("Lỗi kê đơn:", err);
        res.status(500).send("Lỗi Server: " + err.message);
    }
};

// --- 3. Hàm Lấy danh sách thuốc tồn kho (Mới thêm) ---
exports.getMedicines = async (req, res) => {
    try {
        // Chỉ lấy thuốc còn hàng trong kho (> 0)
        const result = await sql.query`
            SELECT MedicineID, Name, StockQuantity, UnitPrice 
            FROM Medicine 
            WHERE StockQuantity > 0 
            ORDER BY Name ASC
        `;
        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi lấy danh sách thuốc" });
    }
};

// --- 4. Hàm xem lịch sử đơn thuốc của bệnh nhân ---
// Server/Controller/doctorController.js

exports.getPrescriptionHistory = async (req, res) => {
    const { patientId } = req.params;
    try {
        // Cập nhật câu Query: Lấy thêm mr.Diagnosis và mr.Notes
        const result = await sql.query`
            SELECT 
                pr.PrescriptionID,
                pr.CreatedDate,
                mr.Diagnosis, 
                mr.Notes,
                m.Name AS DrugName,
                pi.Quantity,
                pi.Dosage,
                pi.Frequency,
                pi.Duration,
                s.FullName AS DoctorName
            FROM Prescription pr
            JOIN MedicalRecord mr ON pr.RecordID = mr.RecordID
            JOIN PrescriptionItem pi ON pr.PrescriptionID = pi.PrescriptionID
            JOIN Medicine m ON pi.MedicineID = m.MedicineID
            JOIN Staff s ON mr.DoctorID = s.StaffID
            WHERE mr.PatientID = ${patientId}
            ORDER BY pr.CreatedDate DESC
        `;
        
        const history = {};
        result.recordset.forEach(row => {
            if (!history[row.PrescriptionID]) {
                history[row.PrescriptionID] = {
                    date: row.CreatedDate,
                    doctor: row.DoctorName,
                    diagnosis: row.Diagnosis, // Lưu chẩn đoán
                    notes: row.Notes,         // Lưu ghi chú
                    drugs: []
                };
            }
            history[row.PrescriptionID].drugs.push({
                name: row.DrugName,
                quantity: row.Quantity,
                dosage: row.Dosage,
                frequency: row.Frequency,
                duration: row.Duration
            });
        });

        res.json(history);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi lấy lịch sử đơn thuốc" });
    }
};

// --- 5. Hàm lấy danh sách bệnh nhân của tôi (Dùng cho Tab Bệnh nhân) ---
exports.getMyPatients = async (req, res) => {
    const { doctorId } = req.params;

    try {
        // Lấy danh sách bệnh nhân duy nhất từ các lịch hẹn của bác sĩ này
        const result = await sql.query`
            SELECT DISTINCT 
                p.PatientID, 
                p.FullName, 
                p.Gender, 
                p.DoB,
                p.Phone, 
                p.Email,
                p.Address
            FROM Patient p
            JOIN Appointment a ON p.PatientID = a.PatientID
            WHERE a.DoctorID = ${doctorId}
            ORDER BY p.FullName ASC
        `;

        res.json(result.recordset);
    } catch (err) {
        console.error("Lỗi lấy danh sách bệnh nhân:", err);
        res.status(500).json({ message: "Lỗi Server khi lấy danh sách bệnh nhân" });
    }
};

// --- 6. Hàm lấy chi tiết đầy đủ hồ sơ bệnh nhân (Dùng cho UI Ảnh 3) ---
exports.getPatientDetail = async (req, res) => {
    const { patientId } = req.params;

    try {
        const result = await sql.query`
            SELECT 
                p.PatientID, p.FullName, p.Gender, p.DoB, p.Phone, p.Email, p.Address,
                p.InsuranceID, p.BloodGroup, p.Allergies, p.MedicalHistory, 
                p.CurrentRoom, p.AdmissionDiagnosis, p.CurrentCondition
            FROM Patient p
            WHERE p.PatientID = ${patientId}
        `;

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy bệnh nhân" });
        }

        res.json(result.recordset[0]);
    } catch (err) {
        console.error("Lỗi lấy chi tiết bệnh nhân:", err);
        res.status(500).json({ message: "Lỗi Server khi lấy dữ liệu chi tiết" });
    }
};

// --- 7. Hàm cập nhật hồ sơ bệnh nhân (Đáp ứng UC005 - Ảnh 1 & 3) ---
exports.updatePatientProfile = async (req, res) => {
    const { patientId } = req.params;
    const { 
        FullName, Gender, DoB, Phone, Address, InsuranceID, 
        BloodGroup, Allergies, MedicalHistory, CurrentRoom, 
        AdmissionDiagnosis, CurrentCondition 
    } = req.body;

    try {
        // Thực hiện update vào bảng Patient
        await sql.query`
            UPDATE Patient
            SET 
                FullName = ${FullName},
                Gender = ${Gender},
                DoB = ${DoB},
                Phone = ${Phone},
                Address = ${Address},
                InsuranceID = ${InsuranceID},
                BloodGroup = ${BloodGroup},
                Allergies = ${Allergies},
                MedicalHistory = ${MedicalHistory},
                CurrentRoom = ${CurrentRoom},
                AdmissionDiagnosis = ${AdmissionDiagnosis},
                CurrentCondition = ${CurrentCondition}
            WHERE PatientID = ${patientId}
        `;

        res.json({ message: "Cập nhật hồ sơ bệnh nhân thành công!" });
    } catch (err) {
        console.error("Lỗi cập nhật hồ sơ:", err);
        res.status(500).json({ message: "Lỗi Server khi cập nhật dữ liệu" });
    }
};

// --- 8. Hàm lấy lịch sử chỉ thị điều dưỡng (Hiển thị cột bên phải UI) ---
exports.getInstructionHistory = async (req, res) => {
    const { patientId } = req.params;

    try {
        // Lấy danh sách chỉ thị kèm theo tên điều dưỡng (nếu đã được tiếp nhận)
        const result = await sql.query`
            SELECT 
                ni.InstructionType AS type,
                ni.Priority AS priority,
                ni.Content AS content,
                ni.Status AS status,
                FORMAT(ni.CreatedAt, 'dd/MM/yyyy HH:mm') AS time,
                s.FullName AS nurseName
            FROM NursingInstructions ni
            LEFT JOIN Staff s ON ni.NurseID = s.StaffID
            WHERE ni.PatientID = ${patientId}
            ORDER BY ni.CreatedAt DESC
        `;

        res.json(result.recordset);
    } catch (err) {
        console.error("Lỗi lấy lịch sử chỉ thị:", err);
        res.status(500).json({ message: "Lỗi Server khi lấy lịch sử chỉ thị" });
    }
};

// --- 9. Hàm lấy danh sách Điều dưỡng (Mới - Dùng cho ô chọn 'Điều dưỡng thực hiện') ---
exports.getNurses = async (req, res) => {
    try {
        // Lấy tất cả nhân viên có Role là Nurse hoặc Điều dưỡng
        const result = await sql.query`
            SELECT StaffID, FullName 
            FROM Staff 
            WHERE Role = N'Nurse' OR Role = N'Điều dưỡng'
            ORDER BY FullName ASC
        `;
        res.json(result.recordset);
    } catch (err) {
        console.error("Lỗi lấy danh sách điều dưỡng:", err);
        res.status(500).json({ message: "Lỗi Server khi lấy danh sách điều dưỡng" });
    }
};

// --- 10. Hàm gửi chỉ thị có chỉ định Điều dưỡng (Thay thế hàm số 8 cũ) ---
exports.sendInstruction = async (req, res) => {
    // Nhận thêm nurseId từ Client
    const { patientId, doctorId, nurseId, type, priority, content } = req.body;

    // Validate: Bắt buộc phải chọn Điều dưỡng và nhập nội dung
    if (!content || content.trim() === "" || !nurseId) {
        return res.status(400).json({ msg: "Vui lòng nhập nội dung và chọn điều dưỡng thực hiện" });
    }

    try {
        // Insert vào DB với NurseID đã chọn
        await sql.query`
            INSERT INTO NursingInstructions (PatientID, DoctorID, NurseID, InstructionType, Priority, Content, Status)
            VALUES (
                ${patientId}, 
                ${doctorId}, 
                ${nurseId}, 
                ${type}, 
                ${priority}, 
                ${content}, 
                N'Chờ xử lý'
            )
        `;

        res.status(200).json({ msg: "Gửi chỉ thị thành công!" });
    } catch (err) {
        console.error("Lỗi gửi chỉ thị:", err);
        res.status(500).json({ message: "Lỗi Server khi gửi chỉ thị điều dưỡng" });
    }
};

// --- 11. Lấy danh sách yêu cầu tư vấn (Hiển thị bên trái màn hình) ---
exports.getConsultationRequests = async (req, res) => {
    try {
        // Lấy danh sách, ưu tiên hiển thị tin chưa trả lời lên trước
        const result = await sql.query`
            SELECT 
                cr.RequestID,
                cr.PatientID,
                p.FullName AS PatientName,
                cr.Specialty,
                cr.Priority,
                cr.Symptoms,
                cr.Status,
                cr.ResponseContent,
                FORMAT(cr.CreatedDate, 'dd/MM/yyyy HH:mm') AS CreatedTime,
                FORMAT(cr.ResponseDate, 'dd/MM/yyyy HH:mm') AS ResponseTime
            FROM ConsultationRequests cr
            JOIN Patient p ON cr.PatientID = p.PatientID
            ORDER BY 
                CASE WHEN cr.Status = N'Chờ phản hồi' THEN 0 ELSE 1 END,
                cr.CreatedDate DESC
        `;
        res.json(result.recordset);
    } catch (err) {
        console.error("Lỗi lấy danh sách tư vấn:", err);
        res.status(500).json({ message: "Lỗi Server khi lấy danh sách tư vấn" });
    }
};

// --- 12. Gửi phản hồi cho bệnh nhân (Nút "Gửi phản hồi") ---
exports.replyConsultation = async (req, res) => {
    const { requestId } = req.params;
    const { doctorId, responseContent } = req.body;

    // Validate dữ liệu
    if (!responseContent || !responseContent.trim()) {
        return res.status(400).json({ msg: "Nội dung phản hồi không được để trống" });
    }

    try {
        // Cập nhật câu trả lời và đổi trạng thái thành 'Đã phản hồi'
        await sql.query`
            UPDATE ConsultationRequests
            SET 
                DoctorID = ${doctorId}, -- Lưu bác sĩ nào đã trả lời
                ResponseContent = ${responseContent},
                Status = N'Đã phản hồi',
                ResponseDate = GETDATE()
            WHERE RequestID = ${requestId}
        `;

        res.json({ msg: "Gửi phản hồi thành công!" });
    } catch (err) {
        console.error("Lỗi gửi phản hồi:", err);
        res.status(500).json({ message: "Lỗi Server khi gửi phản hồi" });
    }
};