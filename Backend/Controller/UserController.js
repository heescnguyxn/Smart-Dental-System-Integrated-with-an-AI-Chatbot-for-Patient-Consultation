const User = require('../Models/User');
const Patient = require('../Models/Patient');
const Doctor = require('../Models/Doctor');

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ msg: 'User not found' });

        let profileData = { user };

        if (user.role === 'patient') {
            const patient = await Patient.findOne({ userId: user._id });
            profileData.patient = patient;
        } else if (user.role === 'doctor') {
            const doctor = await Doctor.findOne({ userId: user._id });
            profileData.doctor = doctor;
        }

        res.json(profileData);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { name, phone, avatar, ...roleSpecificData } = req.body;
        
        // Update generic User details
        const userUpdates = {};
        if (name !== undefined) userUpdates.name = name;
        if (phone !== undefined) userUpdates.phone = phone;
        if (avatar !== undefined) userUpdates.avatar = avatar;

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { $set: userUpdates },
            { new: true }
        ).select('-password');

        if (!updatedUser) return res.status(404).json({ msg: 'User not found' });
        
        let profileData = { user: updatedUser };

        // Update role specific details
        if (updatedUser.role === 'patient') {
            const updatedPatient = await Patient.findOneAndUpdate(
                { userId: updatedUser._id },
                { $set: roleSpecificData },
                { new: true, upsert: true }
            );
            profileData.patient = updatedPatient;
        } else if (updatedUser.role === 'doctor') {
            const updatedDoctor = await Doctor.findOneAndUpdate(
                { userId: updatedUser._id },
                { $set: roleSpecificData },
                { new: true, upsert: true }
            );
            profileData.doctor = updatedDoctor;
        }

        res.json(profileData);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
