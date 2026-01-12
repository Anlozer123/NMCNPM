const adminRepository = require('../Repository/adminRepository');

const isValidPhone = (phone) => /^\d{10}$/.test(phone);

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
        return await adminRepository.createPatient(patientData);
    }

    async updatePatient(id, data) {
        if (data.phone && !isValidPhone(data.phone)) throw new Error("Số điện thoại phải đúng 10 chữ số!");
        
        let query = `UPDATE Patient SET FullName = N'${data.fullName}', Gender = '${data.gender}', DoB = '${data.dob}', 
                     Phone = '${data.phone}', Address = N'${data.address}', Email = '${data.email}',
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
        if (!isValidPhone(staffData.phone)) throw new Error("Số điện thoại không hợp lệ!");
        return await adminRepository.createStaff(staffData);
    }

    async updateStaff(id, data) {
        if (data.phone && !isValidPhone(data.phone)) throw new Error("Số điện thoại không hợp lệ!");
        
        let query = `UPDATE Staff SET FullName = N'${data.fullName}', Role = '${data.role}', 
                     Specialization = N'${data.specialization}', Phone = '${data.phone}', Email = '${data.email}'`;
        
        if (data.password?.trim()) query += `, PasswordHash = '${data.password}' `;
        query += ` WHERE StaffID = ${id}`;
        
        return await adminRepository.updateStaff(id, query);
    }

    async getDashboardStats() {
        return await adminRepository.getStats();
    }
}

module.exports = new AdminService();