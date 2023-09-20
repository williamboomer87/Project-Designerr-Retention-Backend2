const { body } = require('express-validator');

const saveChtValidate = [
  body('token').notEmpty().withMessage('token field is required'),
  body('prompt').notEmpty().withMessage('prompt field is required'),
];

module.exports = {
  saveChtValidate,
};
