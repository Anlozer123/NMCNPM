const doctorService = require('../Service/doctorService');

exports.getAppointments = async (req, res) => {
    try {
        const data = await doctorService.getAppointments(req.params.doctorId);
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi lấy danh sách lịch khám" });
    }
};

exports.prescribeMedication = async (req, res) => {
    try {
        const prescriptionId = await doctorService.prescribeMedication(req.body);
        res.status(200).json({ msg: "Kê đơn thuốc thành công!", prescriptionId });
    } catch (err) {
        console.error("Lỗi kê đơn:", err);
        if (err.message === "Vui lòng kê ít nhất một loại thuốc") {
            return res.status(400).json({ msg: err.message });
        }
        res.status(500).send("Lỗi Server: " + err.message);
    }
};

exports.getMedicines = async (req, res) => {
    try {
        const data = await doctorService.getMedicines();
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: "Lỗi lấy danh sách thuốc" });
    }
};

exports.getPrescriptionHistory = async (req, res) => {
    try {
        const data = await doctorService.getPrescriptionHistory(req.params.patientId);
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi lấy lịch sử đơn thuốc" });
    }
};

exports.getMyPatients = async (req, res) => {
    try {
        const data = await doctorService.getMyPatients(req.params.doctorId);
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: "Lỗi Server" });
    }
};

exports.getPatientDetail = async (req, res) => {
    try {
        const data = await doctorService.getPatientDetail(req.params.patientId);
        if (!data) return res.status(404).json({ message: "Không tìm thấy bệnh nhân" });
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: "Lỗi Server" });
    }
};

exports.updatePatientProfile = async (req, res) => {
    try {
        await doctorService.updatePatientProfile(req.params.patientId, req.body);
        res.json({ message: "Cập nhật hồ sơ bệnh nhân thành công!" });
    } catch (err) {
        res.status(500).json({ message: "Lỗi Server" });
    }
};

exports.getInstructionHistory = async (req, res) => {
    try {
        const data = await doctorService.getInstructionHistory(req.params.patientId);
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: "Lỗi Server" });
    }
};

exports.getNurses = async (req, res) => {
    try {
        const data = await doctorService.getNurses();
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: "Lỗi Server" });
    }
};

exports.sendInstruction = async (req, res) => {
    try {
        await doctorService.sendInstruction({ ...req.body });
        res.status(200).json({ msg: "Gửi chỉ thị thành công!" });
    } catch (err) {
        if (err.message === "Missing content or nurseId") {
            return res.status(400).json({ msg: "Vui lòng nhập nội dung và chọn điều dưỡng" });
        }
        res.status(500).json({ message: "Lỗi Server" });
    }
};

exports.getConsultationRequests = async (req, res) => {
    try {
        const data = await doctorService.getConsultationRequests();
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: "Lỗi Server" });
    }
};

exports.getConsultationMessages = async (req, res) => {
    try {
        const data = await doctorService.getConsultationMessages(req.params.requestId);
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: "Lỗi Server" });
    }
};

exports.replyConsultation = async (req, res) => {
    try {
        if (!req.body.responseContent || !req.body.responseContent.trim()) {
            return res.status(400).json({ msg: "Nội dung không được để trống" });
        }
        
        const messageId = await doctorService.replyConsultation({ 
            requestId: req.params.requestId, 
            ...req.body 
        });
        
        res.json({ msg: "Gửi thành công!", messageId });
    } catch (err) {
        console.error("Lỗi gửi phản hồi:", err);
        res.status(500).json({ message: "Lỗi Server" });
    }
};