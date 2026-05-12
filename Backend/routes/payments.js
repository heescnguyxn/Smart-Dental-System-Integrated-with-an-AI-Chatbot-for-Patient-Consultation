const express = require('express');
const router = express.Router();
const paymentCtrl = require('../Controller/PaymentController');
const auth = require('../middleware/auth');

// Invoice routes
router.get('/invoices', auth, paymentCtrl.getAllInvoices);
router.get('/invoices/my', auth, paymentCtrl.getMyInvoices);
router.put('/invoices/:id/pay', auth, paymentCtrl.payInvoice);

module.exports = router;

