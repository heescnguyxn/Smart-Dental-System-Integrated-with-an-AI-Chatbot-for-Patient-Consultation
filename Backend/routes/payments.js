const express = require('express');
const router = express.Router();
const paymentCtrl = require('../Controller/PaymentController');
const auth = require('../middleware/auth');

router.post('/', auth, paymentCtrl.createPayment);
router.get('/', auth, paymentCtrl.getPayments);

module.exports = router;

