const nurseRepository = require('../Repository/nurseRepository');

class NurseService {
    async getDoctorInstructions() {
        return await nurseRepository.getPendingInstructions();
    }

    async completeInstruction(instructionId) {
        return await nurseRepository.updateInstructionStatus(instructionId, 'Completed');
    }

    async requestEquipment(requestData) {
        // Business Logic: Kiểm tra tồn kho
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

    // Các hàm khác gọi trực tiếp Repo nếu không có logic phức tạp
    async getEquipments() { return await nurseRepository.getAllEquipments(); }
    async getEquipmentRequests() { return await nurseRepository.getEquipmentRequestHistory(); }
    async getMyPatients(nurseId) { return await nurseRepository.getPatientsByNurse(nurseId); }
    async getPatientRequests() { return await nurseRepository.getPendingPatientRequests(); }
    async handlePatientRequest(id, status, note) { return await nurseRepository.updatePatientRequest(id, status, note); }
    async getNurseProfile(id) { return await nurseRepository.getStaffProfile(id); }
}

module.exports = new NurseService();