const express = require('express');
const router = express.Router();
const PrescriptionController = require('../Controller/PrescriptionController');
const auth = require('../middleware/auth');
const authorizeRole = auth.authorizeRole;

router.get('/patient/:patientId', auth, PrescriptionController.getByPatient);
router.get('/medical-record/:medicalRecordId', auth, authorizeRole('doctor', 'patient'), PrescriptionController.getByMedicalRecord);
router.post('/', auth, authorizeRole('doctor'), PrescriptionController.create);
router.put('/:id', auth, authorizeRole('doctor'), PrescriptionController.update);

module.exports = router;
