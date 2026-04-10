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

// All supply routes require auth and staff role
router.get('/', auth, checkStaff, supplyController.getAllSupplies);
router.post('/', auth, checkStaff, supplyController.createSupply);
router.put('/:id', auth, checkStaff, supplyController.updateSupply);
router.delete('/:id', auth, checkStaff, supplyController.deleteSupply);

module.exports = router;
