const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const supplyController = require('../Controller/SupplyController');

// Define permission middleware if needed, but for now auth requires valid user
// Only allow staff/admin to manage supplies (simplified check)

const checkStaff = (req, res, next) => {
    if (req.user.role === 'staff' || req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ msg: 'Access denied: Staff only' });
    }
};

const checkDoctorOrStaff = (req, res, next) => {
    if (req.user.role === 'doctor' || req.user.role === 'staff' || req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ msg: 'Access denied: Staff or Doctor only' });
    }
};

// Doctors can view supplies to prescribe them
router.get('/', auth, checkDoctorOrStaff, supplyController.getAllSupplies);
router.post('/', auth, checkStaff, supplyController.createSupply);
router.put('/:id', auth, checkStaff, supplyController.updateSupply);
router.delete('/:id', auth, checkStaff, supplyController.deleteSupply);

module.exports = router;
