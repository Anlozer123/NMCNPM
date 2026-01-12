const nurseRepository = require('../repositories/nurseRepository');

class NurseService {
    async getSchedule() { return await nurseRepository.getTodaySchedule(); }
    async getInstructions() { return await nurseRepository.getPendingInstructions(); }
    async completeInstruction(id) { return await nurseRepository.completeInstruction(id); }
    async getPatientRequests() { return await nurseRepository.getPatientRequests(); }
    async handlePatientRequest(id, nid) { return await nurseRepository.handlePatientRequest(id, nid); }
    async requestEquipment(data) { return await nurseRepository.requestEquipment(data); }
    async getEquipments() { return await nurseRepository.getAllEquipments(); }
}
module.exports = new NurseService();