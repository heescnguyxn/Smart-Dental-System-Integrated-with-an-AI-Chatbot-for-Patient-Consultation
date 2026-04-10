const Appointment = require('../Models/Appointment');
const Doctor = require('../Models/Doctor');

exports.createAppointment = async (req, res) => {
    try {
        const appointment = new Appointment({ ...req.body, patientId: req.user.id });
        await appointment.save();
        res.status(201).json(appointment);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

exports.getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find()
            .populate('patientId', 'name email phone avatar')
            .populate({
                path: 'doctorId',
                populate: { path: 'userId', select: 'name email phone avatar' }
            })
            .sort({ date: -1 });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

exports.getMyAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ patientId: req.user.id })
            .populate({
                path: 'doctorId',
                populate: { path: 'userId', select: 'name email avatar' }
            });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

exports.getDoctorAppointments = async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ userId: req.user.id });
        if (!doctor) return res.status(404).json({ msg: 'Doctor profile not found' });
        
        const appointments = await Appointment.find({ doctorId: doctor._id })
            .populate('patientId', 'name email');
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

exports.updateAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        let filter = { _id: id };

        if (req.user.role === 'doctor') {
            const doctor = await Doctor.findOne({ userId: req.user.id });
            if (!doctor) return res.status(404).json({ msg: 'Doctor profile not found' });
            filter.doctorId = doctor._id;
        } else if (req.user.role === 'patient') {
            filter.patientId = req.user.id;
        } else {
            return res.status(403).json({ msg: 'Unauthorized access' });
        }

        const appointment = await Appointment.findOneAndUpdate(
             filter,
             { $set: updates },
             { new: true }
        ).populate('patientId', 'name email');

        if (!appointment) return res.status(404).json({ msg: 'Appointment not found or unauthorized' });

        res.json(appointment);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
