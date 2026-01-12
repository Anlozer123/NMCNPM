const express = require('express');
const router = express.Router();
const patientController = require('../Controller/PatientController');

router.get('/:patientId/dashboard', patientController.getPatientDashboardInfo);
router.get('/:patientId/prescriptions', patientController.getPatientPrescriptions);
router.post('/:patientId/request-consultation', patientController.requestConsultation);
router.get('/:patientId/latest-consultation', patientController.getLatestConsultation);
router.get('/doctors-list', patientController.getDoctorsList);
router.get('/:patientId/appointments', patientController.getPatientAppointments);
router.post('/:patientId/appointments', patientController.bookAppointment);
router.put('/appointments/:id/cancel', patientController.cancelAppointment); 
router.get('/:patientId/latest-consultation-full', patientController.getLatestConsultationFull);
router.post('/consultation/:requestId/reply', patientController.replyToConsultation);
router.put('/consultation/message/:messageId', patientController.editMessage);
router.delete('/consultation/message/:messageId', patientController.deleteMessage);
module.exports = router;