const Doctor = require('../Models/Doctor');
const User = require('../Models/User');

exports.getAllDoctors = async (req, res) => {
    try {
        const { specialty, location } = req.query;
        let query = {};
        if (specialty) {
    query.specialty = { $regex: specialty, $options: 'i' };
}
        // location filter later

        const doctors = await Doctor.find(query).populate('userId', 'name email');
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

exports.getDoctorById = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id).populate('userId');
        if (!doctor) return res.status(404).json({ msg: 'Doctor not found' });
        res.json(doctor);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

exports.createDoctor = async (req, res) => {
    try {
        // Assume req.user from auth
        const doctor = new Doctor({ ...req.body, userId: req.user.id });
        await doctor.save();
        res.status(201).json(doctor);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

