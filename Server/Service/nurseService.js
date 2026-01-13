const nurseRepository = require('../Repository/nurseRepository');

class NurseService {
    async getDoctorInstructions(nurseId) { 
        return await nurseRepository.getPendingInstructions(nurseId);
    }

    async completeInstruction(instructionId) {
        // Cập nhật trạng thái thành 'Hoàn thành' để khớp với logic tiếng Việt
        return await nurseRepository.updateInstructionStatus(instructionId, 'Hoàn thành');
    }

    async requestEquipment(requestData) {
        const stock = await nurseRepository.getEquipmentStock(requestData.itemId);
        if (!stock) throw new Error("Thiết bị không tồn tại");
        if (parseInt(requestData.quantity) > stock.Quantity) {
            throw new Error(`Hết hàng! Kho chỉ còn ${stock.Quantity} sản phẩm.`);
        }
        return await nurseRepository.createEquipmentRequest(requestData);
    }

    async getNurseStats(nurseId) {
        try {
            return await nurseRepository.countStats(nurseId);
        } catch (err) {
            return { instructionCount: 0, requestCount: 0, patientCount: 0, equipApprovedCount: 0, equipPendingCount: 0 };
        }
    }

    async getEquipments() { return await nurseRepository.getAllEquipments(); }
    async getEquipmentRequests() { return await nurseRepository.getEquipmentRequestHistory(); }
    async getMyPatients(nurseId) { return await nurseRepository.getPatientsByNurse(nurseId); }
    async getPatientRequests() { return await nurseRepository.getPendingPatientRequests(); }
    async handlePatientRequest(id, status, note) { return await nurseRepository.updatePatientRequest(id, status, note); }
    async getNurseProfile(id) { return await nurseRepository.getStaffProfile(id); }
}

module.exports = new NurseService();