const mongoose = require('mongoose');

const prescriptionItemSchema = new mongoose.Schema({
    supplyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supply', required: true },
    quantity: { type: Number, required: true },
    usage: { type: String, required: true } // Cách dùng
});

const prescriptionSchema = new mongoose.Schema({
    medicalRecordId: { type: mongoose.Schema.Types.ObjectId, ref: 'MedicalRecord' },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    date: { type: Date, required: true, default: Date.now },
    items: [prescriptionItemSchema],
    notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Prescription', prescriptionSchema);
