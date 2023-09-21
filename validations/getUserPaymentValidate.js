const { body } = require('express-validator');

const getUserPaymentValidate = [
    body('token').notEmpty().withMessage('token field is required'),
];

module.exports = {
    getUserPaymentValidate,
};
