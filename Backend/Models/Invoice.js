const mongoose = require('mongoose');

const invoiceItemSchema = new mongoose.Schema({
    supplyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supply' },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 },
    unitPrice: { type: Number, required: true, default: 0 },
    total: { type: Number, required: true, default: 0 }
});

const invoiceSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
    items: [invoiceItemSchema],
    totalAmount: { type: Number, required: true, default: 0 },
    status: { type: String, enum: ['unpaid', 'paid'], default: 'unpaid' },
    paymentMethod: { type: String, enum: ['cash', 'card', 'transfer', 'none'], default: 'none' },
    paymentDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);
