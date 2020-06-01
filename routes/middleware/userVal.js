const { check, validationResult } = require('express-validator/check');

const lastNameChain = check('lastName').exists({ checkNull: true, checkFalsy: true }).withMessage('Please enter your last name');

const firstNameChain = check('firstName').exists({ checkNull: true, checkFalsy: true }).withMessage('Please enter your first name');

const emailChain = check('emailAddress').exists({ checkNull: true, checkFalsy: true }).withMessage('Please enter your email address').isEmail().withMessage('Please enter a valid email address format');

const passwordChain = check('password').exists({ checkNull: true, checkFalsy: true }).withMessage('Please enter a password');

const userValidation = [lastNameChain, firstNameChain, emailChain, passwordChain];

exports.userValidation = userValidation;