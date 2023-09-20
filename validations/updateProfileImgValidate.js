const { body } = require('express-validator');

const updateProfileImgValidate = [
  body('token').notEmpty().withMessage('token field is required'),
];

module.exports = {
  updateProfileImgValidate,
};
