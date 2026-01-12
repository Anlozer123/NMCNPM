const adminService = require('../services/adminService');
class AdminController {
    async getAllStaff(req, res) {
        try { res.json(await adminService.getAllStaff()); } catch (e) { res.status(500).json({ error: e.message }); }
    }
    async createStaff(req, res) {
        try { res.json({ success: true, data: await adminService.createStaff(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
    }
}
module.exports = new AdminController();