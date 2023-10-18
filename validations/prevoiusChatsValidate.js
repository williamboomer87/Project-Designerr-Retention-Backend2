const { body } = require('express-validator');

const prevoiusChatsValidate = [
  body('token').notEmpty().withMessage('token field is required')
];

module.exports = {
  prevoiusChatsValidate,
};
