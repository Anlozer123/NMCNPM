const nurseService = require('../Service/nurseService');

// UC010
exports.getDoctorInstructions = async (req, res) => {
    try {
        const nurseId = req.query.id; // Lấy ID y tá từ tham số URL
        if (!nurseId) return res.status(400).json({ error: "Thiếu ID y tá" });

        const data = await nurseService.getDoctorInstructions(nurseId);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.completeInstruction = async (req, res) => {
    try {
        await nurseService.completeInstruction(req.body.instructionId);
        res.json({ message: "Đã hoàn thành y lệnh!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// UC011
exports.requestEquipment = async (req, res) => {
    try {
        await nurseService.requestEquipment(req.body);
        res.json({ message: "Đã gửi yêu cầu vật tư thành công!" });
    } catch (err) {
        const status = err.message.includes("Hết hàng") ? 400 : 500;
        res.status(status).json({ error: err.message });
    }
};

exports.getEquipments = async (req, res) => {
    try {
        const data = await nurseService.getEquipments();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getEquipmentRequests = async (req, res) => {
    try {
        const data = await nurseService.getEquipmentRequests();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// UC12 & UC13
exports.getMyPatients = async (req, res) => {
    try {
        const data = await nurseService.getMyPatients(req.query.nurseId);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getPatientRequests = async (req, res) => {
    try {
        const data = await nurseService.getPatientRequests();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.handleRequest = async (req, res) => {
    const { requestId, status, note } = req.body;
    try {
        await nurseService.handlePatientRequest(requestId, status, note);
        res.json({ message: "Đã xử lý yêu cầu thành công" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Dashboard & Profile
exports.getNurseProfile = async (req, res) => {
    try {
        const data = await nurseService.getNurseProfile(req.query.id);
        data ? res.json(data) : res.status(404).json({ message: "Không tìm thấy" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getNurseStats = async (req, res) => {
    try {
        const data = await nurseService.getNurseStats(req.query.id);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//Lấy lịch làm việc
exports.getSchedule = async (req, res) => {
    try {
        const nurseId = req.query.id; // Lấy ID từ URL: /api/nurse/schedule?id=3
        if (!nurseId) {
            return res.status(400).json({ error: "Thiếu ID y tá" });
        }

        const data = await nurseService.getNurseSchedule(nurseId);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

