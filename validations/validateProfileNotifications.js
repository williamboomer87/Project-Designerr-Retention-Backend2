const { body } = require('express-validator');

const validateProfileNotifications = [
    body('token').notEmpty().withMessage('token field is required'),
    body('newsUpdates').notEmpty().withMessage('newsUpdates field is required'),
    body('tipsTutorials').notEmpty().withMessage('tipsTutorials field is required'),
    body('userResearch').notEmpty().withMessage('userResearch field is required'),
    body('reminders').notEmpty().withMessage('reminders field is required'),
];

module.exports = {
    validateProfileNotifications,
};
