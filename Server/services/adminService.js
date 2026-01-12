const adminRepository = require('../repositories/adminRepository');

class AdminService {
    async getAllStaff() { return await adminRepository.getAllStaff(); }
    async createStaff(data) {
        const userData = { username: data.username, password: data.password, email: data.email, role: data.role };
        const staffData = { fullName: data.fullName, department: data.department, specialization: data.specialization, phone: data.phone };
        return await adminRepository.createStaff(userData, staffData);
    }
}
module.exports = new AdminService();