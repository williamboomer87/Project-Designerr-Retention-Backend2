const { body } = require('express-validator');

const PYTHON_BACKEND_TOKEN = process.env.PYTHON_BACKEND_TOKAN;

const getPromptImgValidate = [
    body('token').notEmpty().withMessage('token field is required'),
    body('prompt').notEmpty().withMessage('prompt field is required'),
];

module.exports = {
    getPromptImgValidate,
};
