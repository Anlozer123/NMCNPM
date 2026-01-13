const doctorRepo = require('../Repository/doctorRepository');
const { sql } = require('../Config/db');

class DoctorService {

    async getAppointments(doctorId) {
        return await doctorRepo.getAppointmentsByDoctor(doctorId);
    }

    // Logic Kê đơn thuốc phức tạp (Transaction)
    async prescribeMedication({ patientId, doctorId, diagnosis, notes, medications }) {
        if (!medications || medications.length === 0) {
            throw new Error("Vui lòng kê ít nhất một loại thuốc");
        }

        const transaction = new sql.Transaction();
        try {
            await transaction.begin();

            // 1. Tạo Medical Record
            const recordId = await doctorRepo.createMedicalRecord(transaction, { patientId, doctorId, diagnosis, notes });
            
            // 2. Tạo Prescription
            const prescriptionId = await doctorRepo.createPrescription(transaction, recordId);

            // 3. Loop medications
            for (let item of medications) {
                await doctorRepo.addPrescriptionItem(transaction, { prescriptionId, item });
                await doctorRepo.decreaseMedicineStock(transaction, { medicineId: item.medicineId, quantity: item.quantity });
            }

            await transaction.commit();
            return prescriptionId;

        } catch (err) {
            if (transaction._aborted === false) await transaction.rollback();
            throw err;
        }
    }

    async getMedicines() {
        return await doctorRepo.getAvailableMedicines();
    }

    // Logic Grouping dữ liệu lịch sử
    async getPrescriptionHistory(patientId) {
        const rawData = await doctorRepo.getPrescriptionHistoryRaw(patientId);
        
        const history = {};
        rawData.forEach(row => {
            if (!history[row.PrescriptionID]) {
                history[row.PrescriptionID] = {
                    date: row.CreatedDate,
                    doctor: row.DoctorName,
                    diagnosis: row.Diagnosis,
                    notes: row.Notes,
                    drugs: []
                };
            }
            history[row.PrescriptionID].drugs.push({
                name: row.DrugName,
                quantity: row.Quantity,
                dosage: row.Dosage,
                frequency: row.Frequency,
                duration: row.Duration
            });
        });

        return history; // Trả về dạng Object hoặc Object.values(history) tùy frontend
    }

    async getMyPatients(doctorId) {
        return await doctorRepo.getMyPatients(doctorId);
    }

    async getPatientDetail(patientId) {
        return await doctorRepo.getPatientDetail(patientId);
    }

    // Tìm hàm updatePatientProfile và sửa lại như sau:
    async updatePatientProfile(patientId, data) {
    // 1. Kiểm tra trùng lặp
    const duplicate = await doctorRepo.checkDuplicateInfo(patientId, data.Phone, data.InsuranceID);
    
    if (duplicate) {
        // Nếu thấy trùng, ném ra một lỗi kèm thông báo cụ thể
        throw new Error(`Thông tin bị trùng: Số điện thoại hoặc BHYT đã được sử dụng bởi một bệnh nhân hoặc nhân viên khác.`);
    }

    // 2. Chỉ khi không trùng mới chạy tiếp lệnh Update
    return await doctorRepo.updatePatientProfile(patientId, data);
    }

    async getInstructionHistory(patientId) {
        return await doctorRepo.getInstructionHistory(patientId);
    }

    async getNurses() {
        return await doctorRepo.getNurses();
    }

    async sendInstruction(data) {
        if (!data.content || data.content.trim() === "" || !data.nurseId) {
            throw new Error("Missing content or nurseId");
        }
        return await doctorRepo.createInstruction(data);
    }

    async getConsultationRequests(doctorId) {
        return await doctorRepo.getConsultationRequests(doctorId);
    }

    async getConsultationMessages(requestId) {
        return await doctorRepo.getConsultationMessages(requestId);
    }

    // Logic Chat Reply (Transaction)
    async replyConsultation({ requestId, doctorId, responseContent }) {
        const transaction = new sql.Transaction();
        try {
            await transaction.begin();

            const messageId = await doctorRepo.createConsultationMessage(transaction, { requestId, doctorId, content: responseContent });
            await doctorRepo.updateConsultationStatus(transaction, { requestId, doctorId });

            await transaction.commit();
            return messageId;
        } catch (err) {
            if (transaction._aborted === false) await transaction.rollback();
            throw err;
        }
    }

    async getWorkSchedule(doctorId) {
        return await doctorRepo.getWorkSchedule(doctorId);
    }
}

module.exports = new DoctorService();