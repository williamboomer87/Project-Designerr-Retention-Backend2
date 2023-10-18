const { body } = require('express-validator');

const saveChtValidate = [
  body('token').notEmpty().withMessage('token field is required'),
  // body('prompt').notEmpty().withMessage('prompt field is required'),
  body('content').notEmpty().withMessage('content field is required'),
  body('sender').notEmpty().withMessage('sender field is required'),
  body('chatkey').notEmpty().withMessage('chatkey field is required'),
];

module.exports = {
  saveChtValidate,
};
