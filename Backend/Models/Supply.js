const mongoose = require('mongoose');

const supplySchema = new mongoose.Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true, default: 0 },
    unit: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    supplier: { type: String },
    threshold: { type: Number, default: 10 }
}, { timestamps: true });

module.exports = mongoose.model('Supply', supplySchema);
