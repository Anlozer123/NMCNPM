const doctorRepository = require('../repositories/doctorRepository');

class DoctorService {
    async getMyPatients(id) { return await doctorRepository.getMyPatients(id); }
    async prescribe(data) { return await doctorRepository.createPrescriptionTransaction(data); }
    async sendInstruction(data) { return await doctorRepository.createInstruction(data); }
    async getConsultations() { return await doctorRepository.getPendingConsultations(); }
    async replyConsultation(id, did, resp) { return await doctorRepository.replyConsultation(id, did, resp); }
}
module.exports = new DoctorService();