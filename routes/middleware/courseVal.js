const { check, validationResult } = require('express-validator/check');
const titleChain = check('title').exists({ checkNull: true, checkFalsy: true }).withMessage('Please provide a value for "title"');

const descriptionChain = check('description').exists({ checkNull: true, checkFalsy: true }).withMessage('Please provide a value for "description"');

const courseValidation = [titleChain, descriptionChain];
exports.courseValidation = courseValidation;
