const express = require('express');
const router = express.Router();
const User = require('../models').User
var createError = require('http-errors');
const bcryptjs = require('bcryptjs');
const authenticateUser = require('./middleware/authenticateUser.js');
const asyncHandler = require('./middleware/asyncHandler');
const { validationResult } = require('express-validator/check');
// import validation for request body
// array of all the validations needed
const { userValidation } = require('./middleware/userVal');

// GET /api/users 200 - Returns the currently authenticated user

router.get('/users', authenticateUser, asyncHandler(async (req, res, next) => {
    try {
      const currentUser = req.currentUser;

      const user = await User.findByPk(currentUser.id, {
        attributes: {
          exclude: [
            'password',
            'createdAt',
            'updatedAt'
          ],
        }
      });

      res.json(user);
    } 
    catch (error) {
      res.status(500).json({message: error.message});
    }  
  }));

// POST /api/users 201 

router.post("/users", userValidation, asyncHandler(async(req, res, next) => {
  
const errors = validationResult(req);
if (!errors.isEmpty()) {
   // Use the Array `map()` method to get a list of error messages.
   const errorMessages = errors.array().map(error => error.msg);
res.status(400).json({ errors: errorMessages });
 }
  try {
    let user = req.body
    user.password = bcryptjs.hashSync(user.password); 
    const userData = await User.create(user);
    if (userData) {
      res.location('/').status(201).end();
    } else {
      console.log("ELSE THEN 400");
      // sequelize validation error?
      res.sendStatus(400);
      next();
    }
  } catch(error) {
    console.log("CATCH BLOCK")
    if (error.name === "SequelizeValidationError") {
      res.sendStatus(400);
    }
    else {
      console.log("LAST ELSE GROUP")
      next(error);
    }
  }
}));

module.exports = router;