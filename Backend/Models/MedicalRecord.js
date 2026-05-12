const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
    date: { type: Date, required: true, default: Date.now },
    diagnosis: { type: String, required: true },
    symptoms: { type: String },
    notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);
