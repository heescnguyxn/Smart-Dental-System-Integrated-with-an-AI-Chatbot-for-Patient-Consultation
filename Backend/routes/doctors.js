const express = require('express');
const router = express.Router();
const doctorCtrl = require('../Controller/DoctorController');
const auth = require('../middleware/auth');

router.get('/', doctorCtrl.getAllDoctors);
router.get('/:id', doctorCtrl.getDoctorById);
router.post('/', auth, doctorCtrl.createDoctor);

module.exports = router;
