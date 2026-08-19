const express = require('express');
const router = express.Router();
const { getDoctorSummary, getChecklist, chatAgent } = require('../controllers/aiController');

router.get('/summary/:doctorId', getDoctorSummary);
router.get('/checklist/:specialization', getChecklist);
router.post('/chat', chatAgent); // Can be public or protected, leaving public for ease of demo

module.exports = router;
