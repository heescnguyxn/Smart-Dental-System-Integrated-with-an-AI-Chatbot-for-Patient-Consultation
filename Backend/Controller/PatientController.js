const Patient = require('../Models/Patient');
const User = require('../Models/User');

exports.updateProfile = async (req, res) => {
    try {
        const patient = await Patient.findOneAndUpdate(
            { userId: req.user.id },
            req.body,
            { new: true, upsert: true }
        ).populate('userId');
        res.json(patient);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const patient = await Patient.findOne({ userId: req.user.id }).populate('userId');
        res.json(patient);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

