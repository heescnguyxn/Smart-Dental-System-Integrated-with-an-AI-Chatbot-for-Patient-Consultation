const express = require('express');
const router = express.Router();
const appointmentCtrl = require('../Controller/AppointmentController');
const auth = require('../middleware/auth');

router.post('/', auth, appointmentCtrl.createAppointment);
router.get('/', auth, appointmentCtrl.getAllAppointments);
router.get('/my', auth, appointmentCtrl.getMyAppointments);
router.get('/doctor', auth, appointmentCtrl.getDoctorAppointments);
router.put('/:id', auth, appointmentCtrl.updateAppointment);

module.exports = router;

