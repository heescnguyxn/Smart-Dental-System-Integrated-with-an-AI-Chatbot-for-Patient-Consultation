const MedicalRecord = require('../Models/MedicalRecord');
const PaymentController = require('./PaymentController');

const MedicalRecordController = {
    // Get all medical records for a specific patient
    getByPatient: async (req, res) => {
        try {
            const { patientId } = req.params;
            const records = await MedicalRecord.find({ patientId }).populate('doctorId', 'userId specialty').sort({ date: -1 });
            res.json(records);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching medical records', error: error.message });
        }
    },

    // Get medical record by appointment ID
    getByAppointment: async (req, res) => {
        try {
            const { appointmentId } = req.params;
            const record = await MedicalRecord.findOne({ appointmentId });
            res.json(record);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching medical record by appointment', error: error.message });
        }
    },

    // Create a new medical record
    create: async (req, res) => {
        try {
            const { patientId, doctorId, appointmentId, diagnosis, symptoms, notes } = req.body;
            const newRecord = new MedicalRecord({
                patientId, doctorId, appointmentId, diagnosis, symptoms, notes
            });
            const savedRecord = await newRecord.save();
            
            // Auto generate invoice for consultation fee
            await PaymentController.autoGenerateInvoice(appointmentId, patientId, null, []);

            res.status(201).json(savedRecord);
        } catch (error) {
            res.status(500).json({ message: 'Error creating medical record', error: error.message });
        }
    },

    // Update a medical record
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { diagnosis, symptoms, notes } = req.body;
            const updatedRecord = await MedicalRecord.findByIdAndUpdate(
                id, 
                { diagnosis, symptoms, notes }, 
                { new: true }
            );
            if (!updatedRecord) {
                return res.status(404).json({ message: 'Medical record not found' });
            }
            res.json(updatedRecord);
        } catch (error) {
            res.status(500).json({ message: 'Error updating medical record', error: error.message });
        }
    }
};

module.exports = MedicalRecordController;
