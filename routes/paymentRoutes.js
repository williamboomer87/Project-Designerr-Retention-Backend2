const express = require('express');
const router = express.Router();
const { createPayment, getPaymentData } = require('../controllers/paymentController');

router.post('/create-payment-intent', createPayment);

router.post('/get-payment-data', express.raw({type: 'application/json'}), getPaymentData);

module.exports = router;
