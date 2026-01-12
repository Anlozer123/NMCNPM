const patientRepo = require('../Repository/patientRepository');
const { sql } = require('../Config/db'); // Cần để tạo Transaction

class PatientService {
    
    async getDashboardInfo(patientId) {
        const patientData = await patientRepo.getPatientById(patientId);
        if (!patientData) return null;

        // Logic format dữ liệu nằm ở đây
        return {
            ...patientData,
            BloodPressure: (patientData.SystolicBP && patientData.DiastolicBP) 
                           ? `${patientData.SystolicBP} / ${patientData.DiastolicBP}` 
                           : 'N/A'
        };
    }

    async getPrescriptions(patientId) {
        const result = await patientRepo.getPrescriptionsRaw(patientId);
        
        // Logic GROUP BY phức tạp chuyển về Service
        const prescriptionsMap = {};
        result.recordset.forEach(row => {
            if (!prescriptionsMap[row.PrescriptionID]) {
                prescriptionsMap[row.PrescriptionID] = {
                    id: row.PrescriptionID,
                    date: new Date(row.CreatedDate).toLocaleDateString('vi-VN'),
                    label: `Đơn thuốc ngày ${new Date(row.CreatedDate).toLocaleDateString('vi-VN')} - BS. ${row.DoctorName}`,
                    doctor: row.DoctorName,
                    medicines: [],
                    totalBill: 0
                };
            }
            prescriptionsMap[row.PrescriptionID].medicines.push({
                name: row.MedicineName,
                price: row.UnitPrice,
                qty: row.Quantity,
                total: row.TotalLine
            });
            prescriptionsMap[row.PrescriptionID].totalBill += row.TotalLine;
        });

        return Object.values(prescriptionsMap);
    }

    async requestConsultation(patientId, { department, urgency, symptoms }) {
        const transaction = new sql.Transaction();
        try {
            await transaction.begin(); // Bắt đầu Transaction

            // Gọi Repo với transaction scope
            const newRequestId = await patientRepo.createConsultationRequest(transaction, {
                patientId, department, urgency, symptoms
            });

            await patientRepo.createConsultationMessage(transaction, {
                requestId: newRequestId,
                senderId: patientId,
                senderType: 'Patient',
                content: symptoms
            });

            await transaction.commit(); // Thành công thì Commit
            return newRequestId;

        } catch (err) {
            if (transaction._aborted === false) await transaction.rollback(); // Lỗi thì Rollback
            throw err;
        }
    }

    async getLatestConsultation(patientId) {
        return await patientRepo.getLatestConsultation(patientId);
    }

    async getDoctorsList() {
        return await patientRepo.getDoctorsList();
    }

    async getAppointments(patientId) {
        return await patientRepo.getAppointments(patientId);
    }

    async bookAppointment(patientId, { DoctorID, AppointmentDate, Reason }) {
        if (!DoctorID || !AppointmentDate) throw new Error("Missing info");
        return await patientRepo.createAppointment({
            patientId,
            doctorId: DoctorID,
            appointmentDate: new Date(AppointmentDate),
            reason: Reason
        });
    }

    async cancelAppointment(appointmentId) {
        return await patientRepo.cancelAppointment(appointmentId);
    }

    async getLatestConsultationFull(patientId) {
        const requestInfo = await patientRepo.getRequestInfo(patientId);
        if (!requestInfo) return null;

        const messages = await patientRepo.getMessagesByRequestId(requestInfo.RequestID);
        
        return {
            requestInfo,
            messages
        };
    }

    async replyToConsultation({ requestId, senderID, senderType, content }) {
        // Lưu ý: createConsultationMessage ở đây truyền transaction là null hoặc undefined
        return await patientRepo.createConsultationMessage(null, {
            requestId, senderId: senderID, senderType, content
        });
    }

    async editMessage(messageId, { content, senderID }) {
        const rowsAffected = await patientRepo.updateMessage({ messageId, senderId: senderID, content });
        return rowsAffected > 0;
    }

    async deleteMessage(messageId, senderID) {
        const rowsAffected = await patientRepo.deleteMessage({ messageId, senderId: senderID });
        return rowsAffected > 0;
    }
}

module.exports = new PatientService();