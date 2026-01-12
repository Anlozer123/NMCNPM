const nurseService = require('../services/nurseService');
class NurseController {
    async getSchedule(req, res) {
        try { res.json(await nurseService.getSchedule()); } catch (e) { res.status(500).json({ error: e.message }); }
    }
    async getInstructions(req, res) {
        try { res.json(await nurseService.getInstructions()); } catch (e) { res.status(500).json({ error: e.message }); }
    }
    async completeInstruction(req, res) {
        try { await nurseService.completeInstruction(req.params.id); res.json({ success: true }); } catch (e) { res.status(500).json({ error: e.message }); }
    }
    async getPatientRequests(req, res) {
        try { res.json(await nurseService.getPatientRequests()); } catch (e) { res.status(500).json({ error: e.message }); }
    }
    async handlePatientRequest(req, res) {
        try { await nurseService.handlePatientRequest(req.params.id, req.body.nurseId); res.json({ success: true }); } catch (e) { res.status(500).json({ error: e.message }); }
    }
    async requestEquipment(req, res) {
        try { await nurseService.requestEquipment(req.body); res.json({ success: true }); } catch (e) { res.status(500).json({ error: e.message }); }
    }
    async getEquipments(req, res) {
        try { res.json(await nurseService.getEquipments()); } catch (e) { res.status(500).json({ error: e.message }); }
    }
}
module.exports = new NurseController();