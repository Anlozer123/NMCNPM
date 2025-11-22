const { sql } = require('../Config/db');

exports.getAppointments = async (req, res) => {
    const { doctorId } = req.params; // Lấy ID bác sĩ từ đường dẫn

    try {
        // Lấy tên bệnh nhân
        const result = await sql.query`
            SELECT 
                a.AppointmentID, 
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