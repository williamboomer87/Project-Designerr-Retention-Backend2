const { body } = require('express-validator');

const savePaymentValidate = [
    body('token').notEmpty().withMessage('token field is required'),
    body('paymentIntent').notEmpty().withMessage('paymentIntent field is required')
];

module.exports = {
    savePaymentValidate,
};
