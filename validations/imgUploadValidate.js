const { body } = require('express-validator');

const imgUploadValidate = [
  body('imageUrl').notEmpty().withMessage('imageUrl field is required'),
];

module.exports = {
  imgUploadValidate,
};
