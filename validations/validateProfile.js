const { body } = require('express-validator');

const validateProfile = [
  body('token').notEmpty().withMessage('token field is required'),
];

module.exports = {
  validateProfile,
};
