const adminRepository = require('../Repository/adminRepository');

const isValidPhone = (phone) => /^\d{10}$/.test(phone);

// Hàm phụ trợ: Tính tuổi
const validateAge = (dob) => {
    if (!dob) return;
    
    const birthDate = new Date(dob);
    const today = new Date();
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    if (age < 1 || age > 200) {
        throw new Error(`Tuổi không hợp lệ (${age} tuổi). Tuổi phải từ 1 đến 200.`);
    }
};

class AdminService {
    async getAdminProfile(id) {
        return await adminRepository.getAdminById(id);
    }

    async getWorkScheduleData() {
        const schedule = await adminRepository.getSchedules();
        const staff = await adminRepository.getStaffForSchedule();
        return { schedule: schedule.recordset, staff: staff.recordset };
    }

    async getAllPatients() {
        const result = await adminRepository.getAllPatients();
        return result.recordset;
    }

    async addPatient(patientData) {
        if (!isValidPhone(patientData.phone)) throw new Error("Số điện thoại phải bao gồm đúng 10 chữ số!");
        validateAge(patientData.dob);
        const duplicates = await adminRepository.checkDuplicatePatient(patientData.phone, patientData.email);
        if (duplicates.recordset.length > 0) {
            const existing = duplicates.recordset[0];
            if (existing.Phone === patientData.phone) throw new Error("Số điện thoại này đã được sử dụng!");
            if (patientData.email && existing.Email === patientData.email) throw new Error("Email này đã được sử dụng!");
        }

        return await adminRepository.createPatient(patientData);
    }

    async updatePatient(id, data) {
        if (data.phone && !isValidPhone(data.phone)) throw new Error("Số điện thoại phải đúng 10 chữ số!");
        if (data.dob) {
            validateAge(data.dob);
        }
        if (data.phone) {
             const duplicates = await adminRepository.checkDuplicatePatient(data.phone, data.email, id);
             if (duplicates.recordset.length > 0) {
                const existing = duplicates.recordset[0];
                if (existing.Phone === data.phone) throw new Error("Số điện thoại này đã thuộc về bệnh nhân khác!");
                if (data.email && existing.Email === data.email) throw new Error("Email này đã thuộc về bệnh nhân khác!");
            }
        }
        let query = `UPDATE Patient SET 
            FullName = N'${data.fullName}', 
            Gender = '${data.gender}', 
            DoB = '${data.dob}', 
            Phone = '${data.phone}', 
            Address = N'${data.address}', 
            Email = '${data.email || ''}',
            CurrentRoom = ${data.currentRoom ? `'${data.currentRoom}'` : 'NULL'}, 
            NurseID = ${data.nurseId ? data.nurseId : 'NULL'}`;
        
        if (data.password?.trim()) query += `, PasswordHash = '${data.password}' `;
        query += ` WHERE PatientID = ${id}`;
        
        return await adminRepository.updatePatient(id, query);
    }

    async getAllStaff() {
        const result = await adminRepository.getAllStaff();
        return result.recordset;
    }

    async addStaff(staffData) {
        if (!isValidPhone(staffData.phone)) throw new Error("Số điện thoại không hợp lệ (phải đúng 10 số)!");

        const duplicates = await adminRepository.checkDuplicateStaff(staffData.phone, staffData.email);
        if (duplicates.recordset.length > 0) {
            const existing = duplicates.recordset[0];
            if (existing.Phone === staffData.phone) throw new Error("Số điện thoại này đã được nhân viên khác sử dụng!");
            if (staffData.email && existing.Email === staffData.email) throw new Error("Email này đã được nhân viên khác sử dụng!");
        }
        const cleanData = {
            ...staffData,
            specialization: staffData.specialization || null, 
            email: staffData.email || null,
            dob: staffData.dob || null
        };
        return await adminRepository.createStaff(cleanData);
    }

    async updateStaff(id, data) {
        if (data.phone && !isValidPhone(data.phone)) throw new Error("Số điện thoại không hợp lệ!");
        if (data.phone) {
             const duplicates = await adminRepository.checkDuplicateStaff(data.phone, data.email, id);
             if (duplicates.recordset.length > 0) {
                const existing = duplicates.recordset[0];
                if (existing.Phone === data.phone) throw new Error("Số điện thoại này đã thuộc về nhân viên khác!");
                if (data.email && existing.Email === data.email) throw new Error("Email này đã thuộc về nhân viên khác!");
            }
        }
        let query = `UPDATE Staff SET 
            FullName = N'${data.fullName}', 
            Role = '${data.role}', 
            Specialization = N'${data.specialization || ''}', 
            Phone = '${data.phone}', 
            Email = '${data.email || ''}'`;
        
        if (data.password && data.password.trim() !== '') {
            query += `, PasswordHash = '${data.password}'`;
        }
        query += ` WHERE StaffID = ${id}`;
        return await adminRepository.updateStaff(id, query);
    }

    async getDashboardStats() {
        return await adminRepository.getStats();
    }

    async addSchedule(data) {
        const existingSchedule = await adminRepository.checkExistingSchedule(data.staffId, data.workDate);
        
        if (existingSchedule.recordset.length > 0) {
            const currentShift = existingSchedule.recordset[0].ShiftType;
            
            let shiftName = currentShift;
            if (currentShift === 'Morning') shiftName = 'Ca Sáng';
            if (currentShift === 'Afternoon') shiftName = 'Ca Chiều';
            if (currentShift === 'Night') shiftName = 'Ca Đêm';
            if (currentShift === 'Weekend') shiftName = 'Cuối tuần';

            throw new Error(`Nhân viên này đã có lịch làm việc (${shiftName}) vào ngày này rồi!`);
        }
        return await adminRepository.createSchedule(data);
    }

    async getPendingRequests() {
        const result = await adminRepository.getEquipmentRequestsByStatus('Pending');
        return result.recordset;
    }

    async getApprovedRequests() {
        const result = await adminRepository.getEquipmentRequestsByStatus('Approved');
        return result.recordset;
    }

    async approveRequest(id) {
        return await adminRepository.updateRequestStatus(id, 'Approved');
    }

    async rejectRequest(id) {
        return await adminRepository.updateRequestStatus(id, 'Rejected');
    }

    async deliverRequest(id) {
        return await adminRepository.updateRequestStatus(id, 'Delivered');
    }

    async approveRequest(id) {
        return await adminRepository.approveRequestTransaction(id);
    }

    async rejectRequest(id) {
        return await adminRepository.updateRequestStatus(id, 'Rejected');
    }

    async deliverRequest(id) {
        return await adminRepository.updateRequestStatus(id, 'Delivered');
    }
}

module.exports = new AdminService();