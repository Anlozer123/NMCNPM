const doctorService = require('../services/doctorService');
class DoctorController {
    async getMyPatients(req, res) {
        try { res.json(await doctorService.getMyPatients(req.params.id)); } catch (e) { res.status(500).json({ error: e.message }); }
    }
    async prescribe(req, res) {
        try { await doctorService.prescribe(req.body); res.json({ success: true }); } catch (e) { res.status(500).json({ error: e.message }); }
    }
    async sendInstruction(req, res) {
        try { await doctorService.sendInstruction(req.body); res.json({ success: true }); } catch (e) { res.status(500).json({ error: e.message }); }
    }
    async getConsultations(req, res) {
        try { res.json(await doctorService.getConsultations()); } catch (e) { res.status(500).json({ error: e.message }); }
    }
    async replyConsultation(req, res) {
        try { await doctorService.replyConsultation(req.params.id, req.body.doctorId, req.body.response); res.json({ success: true }); } catch (e) { res.status(500).json({ error: e.message }); }
    }
}
module.exports = new DoctorController();