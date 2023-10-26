const { body } = require('express-validator');

const getChtValidate = [
    body('token').notEmpty().withMessage('token field is required'),
    body('chatkey').notEmpty().withMessage('chatkey field is required'),
];

module.exports = {
    getChtValidate,
};
