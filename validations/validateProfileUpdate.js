const { body } = require('express-validator');

const validateProfileUpdate = [
  body('token').notEmpty().withMessage('token field is required'),
  body('email')
    .notEmpty().withMessage('email is required')
    .bail()
    .custom((value, { req }) => {
      if (value) {
        if (!req.body.email.match(/^\S+@\S+\.\S+$/)) {
          throw new Error('Invalid email format');
        }
      }
      return true;
    }),
  body('name').notEmpty().withMessage('name is required')
];

module.exports = {
  validateProfileUpdate,
};
