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
    const { department, urgency, symptoms } = req.body; // Lấy dữ liệu từ Body gửi lên

    try {
        const request = new sql.Request();
        
        // Gán tham số SQL
        request.input('PatientID', sql.Int, patientId);
        request.input('Specialty', sql.NVarChar, department); // Mapping: department -> Specialty
        request.input('Priority', sql.NVarChar, urgency);     // Mapping: urgency -> Priority
        request.input('Symptoms', sql.NVarChar, symptoms);

        // Câu lệnh INSERT vào bảng ConsultationRequests (Xem schema.sql mục 12)
        // Status mặc định là 'Chờ phản hồi' do Database tự set
        const query = `
            INSERT INTO ConsultationRequests (PatientID, Specialty, Priority, Symptoms)
            VALUES (@PatientID, @Specialty, @Priority, @Symptoms)
        `;

        await request.query(query);

        res.status(200).json({ message: "Gửi yêu cầu tư vấn thành công" });

    } catch (err) {
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