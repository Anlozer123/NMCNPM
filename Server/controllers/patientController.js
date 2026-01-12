const patientService = require('../services/patientService');
class PatientController {
    async getProfile(req, res) {
        try { res.json(await patientService.getProfile(req.params.id)); } catch (e) { res.status(500).json({ error: e.message }); }
    }
    async getHistory(req, res) {
        try { res.json(await patientService.getMedicalHistory(req.params.id)); } catch (e) { res.status(500).json({ error: e.message }); }
    }
    async requestConsultation(req, res) {
        try { await patientService.requestConsultation(req.body); res.json({ success: true }); } catch (e) { res.status(500).json({ error: e.message }); }
    }
    async getConsultations(req, res) {
        try { res.json(await patientService.getMyConsultations(req.params.id)); } catch (e) { res.status(500).json({ error: e.message }); }
    }
    async sendRequest(req, res) { // Gửi yêu cầu (chăn, màn..)
        try { await patientService.sendRequest(req.body); res.json({ success: true }); } catch (e) { res.status(500).json({ error: e.message }); }
    }
}
module.exports = new PatientController();