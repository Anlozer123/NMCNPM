// Đường dẫn: Server/Routes/aiRoutes.js
const express = require('express');
const router = express.Router();
const aiController = require('../Controller/aiController'); // Gọi Controller

// Định nghĩa đường dẫn POST: /api/ai/summarize
router.post('/summarize', aiController.summarizeMedicalRecord);
router.get('/patients', aiController.getPatientList);
module.exports = router;