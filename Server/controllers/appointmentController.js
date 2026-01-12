const appointmentService = require('../services/appointmentService');
class AppointmentController {
    async book(req, res) {
        try { res.json({ success: true, data: await appointmentService.book(req.body) }); } catch (e) { res.status(409).json({ error: e.message }); }
    }
}
module.exports = new AppointmentController();