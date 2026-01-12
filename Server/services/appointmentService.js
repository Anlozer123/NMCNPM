const appointmentRepository = require('../repositories/appointmentRepository');

class AppointmentService {
    async book(data) {
        const isBusy = await appointmentRepository.checkAvailability(data.doctorID, data.date, data.startTime, data.endTime);
        if (isBusy) throw new Error('Doctor is busy');
        return await appointmentRepository.create(data);
    }
}
module.exports = new AppointmentService();