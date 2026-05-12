const Invoice = require('../Models/Invoice');
const Supply = require('../Models/Supply');
const Prescription = require('../Models/Prescription');

const PaymentController = {
    // Generate or update invoice automatically
    autoGenerateInvoice: async (appointmentId, patientId, prescriptionId, items) => {
        try {
            let totalAmount = 0;
            const invoiceItems = [];

            // Add consultation fee
            invoiceItems.push({
                name: 'Phí khám bệnh',
                quantity: 1,
                unitPrice: 100000, // 100k
                total: 100000
            });
            totalAmount += 100000;

            // Add supplies from prescription
            if (items && items.length > 0) {
                for (let item of items) {
                    const supply = await Supply.findById(item.supplyId);
                    if (supply) {
                        const total = item.quantity * supply.price;
                        invoiceItems.push({
                            supplyId: supply._id,
                            name: supply.name,
                            quantity: item.quantity,
                            unitPrice: supply.price,
                            total: total
                        });
                        totalAmount += total;
                    }
                }
            }

            // Check if invoice already exists
            const existingInvoice = await Invoice.findOne({ appointmentId });
            if (existingInvoice) {
                // If already paid, don't update
                if (existingInvoice.status === 'paid') return existingInvoice;

                existingInvoice.items = invoiceItems;
                existingInvoice.totalAmount = totalAmount;
                if (prescriptionId) existingInvoice.prescriptionId = prescriptionId;
                await existingInvoice.save();
                return existingInvoice;
            } else {
                const newInvoice = new Invoice({
                    patientId,
                    appointmentId,
                    prescriptionId,
                    items: invoiceItems,
                    totalAmount
                });
                await newInvoice.save();
                return newInvoice;
            }
        } catch (error) {
            console.error('Error auto generating invoice:', error);
            throw error;
        }
    },

    // Get all invoices (for staff)
    getAllInvoices: async (req, res) => {
        try {
            const invoices = await Invoice.find()
                .populate('patientId', 'name phone email')
                .populate({
                    path: 'appointmentId',
                    populate: { path: 'doctorId', populate: { path: 'userId', select: 'name' } }
                })
                .sort({ createdAt: -1 });
            res.json(invoices);
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    },

    // Get patient invoices
    getMyInvoices: async (req, res) => {
        try {
            const invoices = await Invoice.find({ patientId: req.user.id })
                .populate({
                    path: 'appointmentId',
                    populate: { path: 'doctorId', populate: { path: 'userId', select: 'name' } }
                })
                .sort({ createdAt: -1 });
            res.json(invoices);
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    },

    // Pay invoice
    payInvoice: async (req, res) => {
        try {
            const { id } = req.params;
            const { paymentMethod } = req.body;

            const invoice = await Invoice.findById(id);
            if (!invoice) return res.status(404).json({ msg: 'Invoice not found' });

            invoice.status = 'paid';
            invoice.paymentMethod = paymentMethod || 'cash';
            invoice.paymentDate = new Date();
            await invoice.save();

            res.json(invoice);
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    }
};

module.exports = PaymentController;
