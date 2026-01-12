const patientService = require('../Service/patientService');

exports.getPatientDashboardInfo = async (req, res) => {
    try {
        const data = await patientService.getDashboardInfo(req.params.patientId);
        if (!data) return res.status(404).json({ message: "Không tìm thấy hồ sơ bệnh nhân" });
        res.json(data);
    } catch (err) {
        console.error("Lỗi Dashboard:", err);
        res.status(500).json({ message: "Lỗi Server" });
    }
};

exports.getPatientPrescriptions = async (req, res) => {
    try {
        const data = await patientService.getPrescriptions(req.params.patientId);
        res.json(data);
    } catch (err) {
        console.error("Lỗi lấy đơn thuốc:", err);
        res.status(500).json({ message: "Lỗi Server" });
    }
};

exports.requestConsultation = async (req, res) => {
    try {
        const requestId = await patientService.requestConsultation(req.params.patientId, req.body);
        res.status(200).json({ message: "Gửi yêu cầu thành công", requestId });
    } catch (err) {
        console.error("Lỗi gửi yêu cầu:", err);
        res.status(500).json({ message: "Lỗi Server" });
    }
};

exports.getLatestConsultation = async (req, res) => {
    try {
        const data = await patientService.getLatestConsultation(req.params.patientId);
        res.json(data || null);
    } catch (err) {
        console.error("Lỗi lấy tư vấn:", err);
        res.status(500).json({ message: "Lỗi Server" });
    }
};

exports.getDoctorsList = async (req, res) => {
    try {
        const data = await patientService.getDoctorsList();
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: "Lỗi Server" });
    }
};

exports.getPatientAppointments = async (req, res) => {
    try {
        const data = await patientService.getAppointments(req.params.patientId);
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: "Lỗi Server" });
    }
};

exports.bookAppointment = async (req, res) => {
    try {
        await patientService.bookAppointment(req.params.patientId, req.body);
        res.status(200).json({ message: "Đặt lịch thành công" });
    } catch (err) {
        if (err.message === "Missing info") return res.status(400).json({ message: "Thiếu thông tin" });
        console.error("Lỗi đặt lịch:", err);
        res.status(500).json({ message: "Lỗi Server" });
    }
};

exports.cancelAppointment = async (req, res) => {
    try {
        await patientService.cancelAppointment(req.params.id);
        res.status(200).json({ message: "Đã hủy lịch hẹn" });
    } catch (err) {
        res.status(500).json({ message: "Lỗi Server" });
    }
};

exports.getLatestConsultationFull = async (req, res) => {
    try {
        const data = await patientService.getLatestConsultationFull(req.params.patientId);
        res.json(data || null);
    } catch (err) {
        res.status(500).json({ message: "Lỗi Server" });
    }
};

exports.replyToConsultation = async (req, res) => {
    try {
        const messageId = await patientService.replyToConsultation({ 
            requestId: req.params.requestId, 
            ...req.body 
        });
        res.status(200).json({ message: "Đã gửi tin nhắn", messageId });
    } catch (err) {
        res.status(500).json({ message: "Lỗi Server" });
    }
};

exports.editMessage = async (req, res) => {
    try {
        const success = await patientService.editMessage(req.params.messageId, req.body);
        if (success) res.status(200).json({ message: "Cập nhật thành công" });
        else res.status(403).json({ message: "Không có quyền sửa hoặc tin nhắn không tồn tại" });
    } catch (err) {
        res.status(500).json({ message: "Lỗi Server" });
    }
};

exports.deleteMessage = async (req, res) => {
    try {
        const success = await patientService.deleteMessage(req.params.messageId, req.body.senderID);
        if (success) res.status(200).json({ message: "Xóa thành công" });
        else res.status(403).json({ message: "Không thể xóa" });
    } catch (err) {
        res.status(500).json({ message: "Lỗi Server" });
    }
};