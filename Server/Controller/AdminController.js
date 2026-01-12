const adminService = require('../Service/adminService');

exports.getAdminProfile = async (req, res) => {
    try {
        const admin = await adminService.getAdminProfile(req.query.id);
        admin ? res.json(admin) : res.status(404).json({ message: "Không tìm thấy" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getWorkSchedule = async (req, res) => {
    try {
        const data = await adminService.getWorkScheduleData();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllPatients = async (req, res) => {
    try {
        const patients = await adminService.getAllPatients();
        res.json(patients);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addPatient = async (req, res) => {
    try {
        await adminService.addPatient(req.body);
        res.json({ success: true, message: "Thêm thành công!" });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

exports.updatePatient = async (req, res) => {
    try {
        await adminService.updatePatient(req.params.id, req.body);
        res.json({ success: true, message: "Cập nhật thành công!" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.getAllStaff = async (req, res) => {
    try {
        const staff = await adminService.getAllStaff();
        res.json(staff);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addStaff = async (req, res) => {
    try {
        await adminService.addStaff(req.body);
        res.json({ success: true, message: "Thêm nhân viên thành công!" });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

exports.updateStaff = async (req, res) => {
    try {
        await adminService.updateStaff(req.params.id, req.body);
        res.json({ success: true, message: "Cập nhật nhân viên thành công!" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.getDashboardStats = async (req, res) => {
    try {
        const stats = await adminService.getDashboardStats();
        res.json(stats);
    } catch (err) {
        res.json({ patientCount: 0, doctorCount: 0, nurseCount: 0, appointmentCount: 0, requestCount: 0 });
    }
};