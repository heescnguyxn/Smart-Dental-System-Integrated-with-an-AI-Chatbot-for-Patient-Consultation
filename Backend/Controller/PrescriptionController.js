const Prescription = require('../Models/Prescription');
const PaymentController = require('./PaymentController');
const Appointment = require('../Models/Appointment');

const PrescriptionController = {
    // Get prescriptions for a specific patient
    getByPatient: async (req, res) => {
        try {
            const { patientId } = req.params;
            const prescriptions = await Prescription.find({ patientId })
                .populate({
                    path: 'doctorId',
                    populate: { path: 'userId', select: 'name' }
                })
                .populate('items.supplyId', 'name unit')
                .sort({ date: -1 });
            res.json(prescriptions);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching prescriptions', error: error.message });
        }
    },

    // Get prescription by medical record
    getByMedicalRecord: async (req, res) => {
        try {
            const { medicalRecordId } = req.params;
            const prescription = await Prescription.findOne({ medicalRecordId })
                .populate('items.supplyId', 'name unit');
            res.json(prescription);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching prescription by medical record', error: error.message });
        }
    },

    // Create a new prescription
    create: async (req, res) => {
        try {
            const { medicalRecordId, patientId, doctorId, items, notes } = req.body;
            const newPrescription = new Prescription({
                medicalRecordId, patientId, doctorId, items, notes
            });
            const savedPrescription = await newPrescription.save();
            
            // Auto update invoice
            const medicalRecord = await require('../Models/MedicalRecord').findById(medicalRecordId);
            if (medicalRecord && medicalRecord.appointmentId) {
                await PaymentController.autoGenerateInvoice(medicalRecord.appointmentId, patientId, savedPrescription._id, items);
            }

            res.status(201).json(savedPrescription);
        } catch (error) {
            res.status(500).json({ message: 'Error creating prescription', error: error.message });
        }
    },

    // Update a prescription
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { items, notes } = req.body;
            const updatedPrescription = await Prescription.findByIdAndUpdate(
                id, 
                { items, notes }, 
                { new: true }
            );
            if (!updatedPrescription) {
                return res.status(404).json({ message: 'Prescription not found' });
            }
            
            // Auto update invoice
            const medicalRecord = await require('../Models/MedicalRecord').findById(updatedPrescription.medicalRecordId);
            if (medicalRecord && medicalRecord.appointmentId) {
                await PaymentController.autoGenerateInvoice(medicalRecord.appointmentId, updatedPrescription.patientId, updatedPrescription._id, items);
            }

            res.json(updatedPrescription);
        } catch (error) {
            res.status(500).json({ message: 'Error updating prescription', error: error.message });
        }
    }
};

module.exports = PrescriptionController;
