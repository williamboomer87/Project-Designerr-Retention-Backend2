const { body } = require('express-validator');

const validateSignUp = [
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
  body('name').notEmpty().withMessage('name is required'),
  body('password').notEmpty().withMessage('password is required'),
];

module.exports = {
  validateSignUp,
};
