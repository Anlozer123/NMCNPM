const { sql } = require('../Config/db');

exports.getPatientDashboardInfo = async (req, res) => {
    const { patientId } = req.params; // Lấy ID từ URL

    try {
        // Truy vấn lấy thông tin cá nhân + Chỉ số sinh hiệu mới nhất
        const result = await sql.query`
            SELECT 
                PatientID, 
                FullName, 
                Gender, 
                DoB, 
                Phone, 
                Email, 
                Address, 
                
                -- Các chỉ số sinh hiệu (Vitals)
                Height, 
                Weight, 
                BMI, 
                HeartRate, 
                BloodSugar, 
                SystolicBP, 
                DiastolicBP
            FROM Patient
            WHERE PatientID = ${patientId}
        `;

        // Kiểm tra nếu không tìm thấy bệnh nhân
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy hồ sơ bệnh nhân" });
        }

        // Lấy bản ghi đầu tiên
        const patientData = result.recordset[0];

        // Xử lý format dữ liệu trước khi trả về Client (nếu cần)
        // Ví dụ: Gộp huyết áp để frontend dễ hiển thị
        const formattedData = {
            ...patientData,
            BloodPressure: (patientData.SystolicBP && patientData.DiastolicBP) 
                           ? `${patientData.SystolicBP} / ${patientData.DiastolicBP}` 
                           : 'N/A'
        };

        res.json(formattedData);

    } catch (err) {
        console.error("Lỗi lấy thông tin Dashboard:", err);
        res.status(500).json({ message: "Lỗi Server khi lấy dữ liệu Dashboard" });
    }
};
// API: GET /api/patient/:patientId/prescriptions
exports.getPatientPrescriptions = async (req, res) => {
    const { patientId } = req.params;

    try {
        // Truy vấn lấy chi tiết đơn thuốc + thuốc + bác sĩ kê đơn
        // Logic: Patient -> MedicalRecord -> Prescription -> PrescriptionItem -> Medicine
        const query = `
            SELECT 
                P.PrescriptionID,
                P.CreatedDate,
                S.FullName AS DoctorName,
                M.Name AS MedicineName,
                M.UnitPrice,
                PI.Quantity,
                (M.UnitPrice * PI.Quantity) AS TotalLine
            FROM Prescription P
            JOIN MedicalRecord MR ON P.RecordID = MR.RecordID
            JOIN Staff S ON MR.DoctorID = S.StaffID
            JOIN PrescriptionItem PI ON P.PrescriptionID = PI.PrescriptionID
            JOIN Medicine M ON PI.MedicineID = M.MedicineID
            WHERE MR.PatientID = @PatientID
            ORDER BY P.CreatedDate DESC
        `;

        const request = new sql.Request();
        request.input('PatientID', sql.Int, patientId);
        
        const result = await request.query(query);

        // --- XỬ LÝ DỮ LIỆU (GROUP BY PRESCRIPTION) ---
        // SQL trả về dạng bảng phẳng (flat rows), ta cần gom nhóm theo PrescriptionID
        const prescriptionsMap = {};

        result.recordset.forEach(row => {
            // Nếu đơn thuốc chưa tồn tại trong map, tạo mới
            if (!prescriptionsMap[row.PrescriptionID]) {
                prescriptionsMap[row.PrescriptionID] = {
                    id: row.PrescriptionID,
                    // Format ngày: DD/MM/YYYY
                    date: new Date(row.CreatedDate).toLocaleDateString('vi-VN'),
                    label: `Đơn thuốc ngày ${new Date(row.CreatedDate).toLocaleDateString('vi-VN')} - BS. ${row.DoctorName}`,
                    doctor: row.DoctorName,
                    medicines: [],
                    totalBill: 0
                };
            }

            // Thêm thuốc vào danh sách thuốc của đơn này
            prescriptionsMap[row.PrescriptionID].medicines.push({
                name: row.MedicineName,
                price: row.UnitPrice,
                qty: row.Quantity,
                total: row.TotalLine
            });

            // Cộng dồn tổng tiền
            prescriptionsMap[row.PrescriptionID].totalBill += row.TotalLine;
        });

        // Chuyển Map thành Array để trả về Frontend
        const responseData = Object.values(prescriptionsMap);

        res.json(responseData);

    } catch (err) {
        console.error("Lỗi lấy đơn thuốc:", err);
        res.status(500).json({ message: "Lỗi Server khi lấy đơn thuốc" });
    }
};
// API: POST /api/patient/:patientId/request-consultation
exports.requestConsultation = async (req, res) => {
    const { patientId } = req.params;
    const { department, urgency, symptoms } = req.body;

    const transaction = new sql.Transaction();
    try {
        await transaction.begin();

        // 1. Insert vào bảng cha (ConsultationRequests)
        const requestRequest = new sql.Request(transaction);
        requestRequest.input('PatientID', sql.Int, patientId);
        requestRequest.input('Specialty', sql.NVarChar, department);
        requestRequest.input('Priority', sql.NVarChar, urgency);
        requestRequest.input('Symptoms', sql.NVarChar, symptoms);

        // Dùng OUTPUT INSERTED.RequestID để lấy ID vừa tạo
        const insertRequestQuery = `
            INSERT INTO ConsultationRequests (PatientID, Specialty, Priority, Symptoms)
            OUTPUT INSERTED.RequestID
            VALUES (@PatientID, @Specialty, @Priority, @Symptoms)
        `;
        
        const requestResult = await requestRequest.query(insertRequestQuery);
        const newRequestId = requestResult.recordset[0].RequestID;

        // 2. Insert tin nhắn đầu tiên vào bảng con (ConsultationMessages)
        const messageRequest = new sql.Request(transaction);
        messageRequest.input('RequestID', sql.Int, newRequestId);
        messageRequest.input('SenderID', sql.Int, patientId);
        messageRequest.input('Content', sql.NVarChar, symptoms);

        await messageRequest.query(`
            INSERT INTO ConsultationMessages (RequestID, SenderID, SenderType, Content)
            VALUES (@RequestID, @SenderID, 'Patient', @Content)
        `);

        await transaction.commit();
        res.status(200).json({ message: "Gửi yêu cầu tư vấn thành công", requestId: newRequestId });

    } catch (err) {
        if (transaction._aborted === false) {
             await transaction.rollback();
        }
        console.error("Lỗi gửi yêu cầu tư vấn:", err);
        res.status(500).json({ message: "Lỗi Server khi tạo yêu cầu" });
    }
};
// API: GET /api/patient/:patientId/latest-consultation
exports.getLatestConsultation = async (req, res) => {
    const { patientId } = req.params;
    try {
        // Lấy yêu cầu tư vấn mới nhất
        const query = `
            SELECT TOP 1 
                RequestID, Specialty, Priority, Symptoms, 
                ResponseContent, Status, CreatedDate, ResponseDate
            FROM ConsultationRequests
            WHERE PatientID = @PatientID
            ORDER BY CreatedDate DESC
        `;
        
        const request = new sql.Request();
        request.input('PatientID', sql.Int, patientId);
        const result = await request.query(query);

        if (result.recordset.length > 0) {
            res.json(result.recordset[0]);
        } else {
            res.json(null); // Không có dữ liệu
        }
    } catch (err) {
        console.error("Lỗi lấy tư vấn:", err);
        res.status(500).json({ message: "Lỗi Server" });
    }
};
// [MỚI] API: GET /api/patient/doctors-list
// Lấy danh sách bác sĩ để đổ vào dropdown
exports.getDoctorsList = async (req, res) => {
    try {
        // Lấy Staff có Role là Doctor (theo sample_1.sql)
        const result = await sql.query`
            SELECT StaffID, FullName, Specialization 
            FROM Staff 
            WHERE Role = 'Doctor'
        `;
        res.json(result.recordset);
    } catch (err) {
        console.error("Lỗi lấy danh sách bác sĩ:", err);
        res.status(500).json({ message: "Lỗi Server" });
    }
};

// [MỚI] API: GET /api/patient/:patientId/appointments
// Lấy lịch sử khám bệnh
exports.getPatientAppointments = async (req, res) => {
    const { patientId } = req.params;
    try {
        // Join bảng Appointment và Staff để lấy tên bác sĩ
        // Cập nhật: Thêm điều kiện status khác 'Cancelled'
        const query = `
            SELECT 
                A.AppointmentID,
                S.FullName AS DoctorName,
                S.Specialization,
                A.AppointmentDate,
                A.Reason,
                A.Status
            FROM Appointment A
            JOIN Staff S ON A.DoctorID = S.StaffID
            WHERE A.PatientID = @PatientID 
              AND A.Status != 'Cancelled' 
            ORDER BY A.AppointmentDate DESC
        `;
        
        const request = new sql.Request();
        request.input('PatientID', sql.Int, patientId);
        const result = await request.query(query);

        res.json(result.recordset);
    } catch (err) {
        console.error("Lỗi lấy lịch khám:", err);
        res.status(500).json({ message: "Lỗi Server" });
    }
};

// [MỚI] API: POST /api/patient/:patientId/appointments
// Đặt lịch khám mới
exports.bookAppointment = async (req, res) => {
    const { patientId } = req.params;
    const { DoctorID, AppointmentDate, Reason } = req.body;

    if (!DoctorID || !AppointmentDate) {
        return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
    }

    try {
        const query = `
            INSERT INTO Appointment (PatientID, DoctorID, AppointmentDate, Reason, Status)
            VALUES (@PatientID, @DoctorID, @AppointmentDate, @Reason, 'Pending')
        `;

        const request = new sql.Request();
        request.input('PatientID', sql.Int, patientId);
        request.input('DoctorID', sql.Int, DoctorID);
        // Lưu ý: AppointmentDate gửi lên phải đúng format 'YYYY-MM-DD HH:mm:ss'
        request.input('AppointmentDate', sql.DateTime, new Date(AppointmentDate)); 
        request.input('Reason', sql.NVarChar, Reason);

        await request.query(query);

        res.status(200).json({ message: "Đặt lịch thành công" });
    } catch (err) {
        console.error("Lỗi đặt lịch:", err);
        res.status(500).json({ message: "Lỗi Server khi đặt lịch" });
    }
};

// [MỚI] API: PUT /api/patient/appointments/:id/cancel
// Hủy lịch khám
exports.cancelAppointment = async (req, res) => {
    const { id } = req.params; // AppointmentID
    try {
        const query = `
            UPDATE Appointment 
            SET Status = 'Cancelled' 
            WHERE AppointmentID = @AppointmentID
        `;
        
        const request = new sql.Request();
        request.input('AppointmentID', sql.Int, id);
        await request.query(query);

        res.status(200).json({ message: "Đã hủy lịch hẹn" });
    } catch (err) {
        console.error("Lỗi hủy lịch:", err);
        res.status(500).json({ message: "Lỗi Server" });
    }
};
// [MỚI] API: GET /api/patient/:patientId/latest-consultation-full
// Lấy thông tin phiên tư vấn VÀ lịch sử chat
exports.getLatestConsultationFull = async (req, res) => {
    const { patientId } = req.params;
    try {
        // 1. Lấy thông tin phiên tư vấn mới nhất
        const requestInfoQuery = `
            SELECT TOP 1 
                R.RequestID, R.Specialty, R.Priority, R.Status, 
                R.CreatedDate, S.FullName AS DoctorName
            FROM ConsultationRequests R
            LEFT JOIN Staff S ON R.DoctorID = S.StaffID
            WHERE R.PatientID = @PatientID
            ORDER BY R.CreatedDate DESC
        `;
        
        const req1 = new sql.Request();
        req1.input('PatientID', sql.Int, patientId);
        const infoResult = await req1.query(requestInfoQuery);

        if (infoResult.recordset.length === 0) {
            return res.json(null); // Không có dữ liệu
        }

        const requestInfo = infoResult.recordset[0];

        // 2. Lấy danh sách tin nhắn của phiên này
        // [QUAN TRỌNG] Đã thêm MessageID và UpdatedAt vào câu SELECT
        const messagesQuery = `
            SELECT MessageID, SenderID, SenderType, Content, SentAt, UpdatedAt
            FROM ConsultationMessages
            WHERE RequestID = @RequestID
            ORDER BY SentAt ASC
        `;

        const req2 = new sql.Request();
        req2.input('RequestID', sql.Int, requestInfo.RequestID);
        const msgResult = await req2.query(messagesQuery);

        // 3. Trả về format chuẩn cho Frontend
        res.json({
            requestInfo: requestInfo,
            messages: msgResult.recordset
        });

    } catch (err) {
        console.error("Lỗi lấy chi tiết tư vấn:", err);
        res.status(500).json({ message: "Lỗi Server" });
    }
};
// [MỚI] API: POST /api/patient/consultation/:requestId/reply
// Gửi tin nhắn trả lời vào phiên chat
exports.replyToConsultation = async (req, res) => {
    const { requestId } = req.params;
    const { senderID, senderType, content } = req.body;

    try {
        const request = new sql.Request();
        request.input('RequestID', sql.Int, requestId);
        request.input('SenderID', sql.Int, senderID);
        request.input('SenderType', sql.NVarChar, senderType);
        request.input('Content', sql.NVarChar, content);

        // SỬA: Thêm OUTPUT INSERTED.MessageID để lấy ID thật từ DB
        const query = `
            INSERT INTO ConsultationMessages (RequestID, SenderID, SenderType, Content)
            OUTPUT INSERTED.MessageID
            VALUES (@RequestID, @SenderID, @SenderType, @Content)
        `;

        const result = await request.query(query);
        const newMessageId = result.recordset[0].MessageID; // Lấy ID thật

        res.status(200).json({ 
            message: "Đã gửi tin nhắn", 
            messageId: newMessageId // Trả về cho Frontend
        });

    } catch (err) {
        console.error("Lỗi gửi tin nhắn:", err);
        res.status(500).json({ message: "Lỗi Server" });
    }
};
// [MỚI] API: PUT /api/patient/consultation/message/:messageId
// Chỉnh sửa tin nhắn
exports.editMessage = async (req, res) => {
    const { messageId } = req.params;
    const { content, senderID } = req.body;

    try {
        const request = new sql.Request();
        request.input('MessageID', sql.Int, messageId);
        request.input('SenderID', sql.Int, senderID);
        request.input('Content', sql.NVarChar, content);

        // Logic: Chỉ cho phép sửa nếu đúng người gửi (SenderID)
        // và cập nhật UpdatedAt = GETDATE()
        const query = `
            UPDATE ConsultationMessages
            SET Content = @Content, UpdatedAt = GETDATE()
            WHERE MessageID = @MessageID AND SenderID = @SenderID
        `;

        const result = await request.query(query);

        if (result.rowsAffected[0] > 0) {
            res.status(200).json({ message: "Cập nhật thành công" });
        } else {
            res.status(403).json({ message: "Không có quyền sửa hoặc tin nhắn không tồn tại" });
        }

    } catch (err) {
        console.error("Lỗi sửa tin nhắn:", err);
        res.status(500).json({ message: "Lỗi Server" });
    }
};
// [MỚI] API: DELETE /api/patient/consultation/message/:messageId
exports.deleteMessage = async (req, res) => {
    const { messageId } = req.params;
    const { senderID } = req.body; // Cần gửi SenderID để xác minh quyền sở hữu

    try {
        const request = new sql.Request();
        request.input('MessageID', sql.Int, messageId);
        request.input('SenderID', sql.Int, senderID);

        // Chỉ xóa được nếu đúng là tin nhắn của người đó gửi
        const query = `
            DELETE FROM ConsultationMessages
            WHERE MessageID = @MessageID AND SenderID = @SenderID
        `;

        const result = await request.query(query);

        if (result.rowsAffected[0] > 0) {
            res.status(200).json({ message: "Xóa thành công" });
        } else {
            res.status(403).json({ message: "Không thể xóa (Tin nhắn không tồn tại hoặc không đủ quyền)" });
        }

    } catch (err) {
        console.error("Lỗi xóa tin nhắn:", err);
        res.status(500).json({ message: "Lỗi Server" });
    }
};