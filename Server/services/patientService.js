const patientRepository = require('../repositories/patientRepository');

class PatientService {
    async getProfile(id) { return await patientRepository.getProfile(id); }
    async getMedicalHistory(id) {
        const raw = await patientRepository.getMedicalHistory(id);
        // Group logic if needed, simple return for now
        return raw; 
    }
    async requestConsultation(data) { return await patientRepository.createConsultation(data); }
    async getMyConsultations(id) { return await patientRepository.getMyConsultations(id); }
    async sendRequest(data) { return await patientRepository.createPatientRequest(data); }
}
module.exports = new PatientService();