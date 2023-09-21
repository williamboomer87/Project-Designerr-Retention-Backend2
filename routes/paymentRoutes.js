const express = require('express');
const router = express.Router();
const { createPayment, savePayment, getUserPayment } = require('../controllers/paymentController');
const { savePaymentValidate } = require('../validations/savePaymentValidate'); 
const { getUserPaymentValidate } = require('../validations/getUserPaymentValidate'); 

router.post('/create-payment-intent', createPayment);

router.post('/save_payment', savePaymentValidate, savePayment);

router.post('/get_user_payments', getUserPaymentValidate , getUserPayment);

module.exports = router;
