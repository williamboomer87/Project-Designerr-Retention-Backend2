const express = require('express');
const router = express.Router();
const {  getPaymentData } = require('../controllers/paymentController');

router.post('/get-payment-data', express.raw({type: 'application/json'}), getPaymentData);

module.exports = router;