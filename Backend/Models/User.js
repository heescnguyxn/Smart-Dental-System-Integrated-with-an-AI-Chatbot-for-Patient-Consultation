const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ['patient', 'doctor', 'staff'], default: 'patient' },
    phone: String,
    avatar: String
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

