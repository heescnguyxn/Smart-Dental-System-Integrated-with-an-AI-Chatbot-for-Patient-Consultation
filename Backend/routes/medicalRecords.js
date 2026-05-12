const express = require('express');
const router = express.Router();
const MedicalRecordController = require('../Controller/MedicalRecordController');
const auth = require('../middleware/auth');
const authorizeRole = auth.authorizeRole;

router.get('/patient/:patientId', auth, MedicalRecordController.getByPatient);
router.get('/appointment/:appointmentId', auth, authorizeRole('doctor', 'patient'), MedicalRecordController.getByAppointment);
router.post('/', auth, authorizeRole('doctor'), MedicalRecordController.create);
router.put('/:id', auth, authorizeRole('doctor'), MedicalRecordController.update);

module.exports = router;
