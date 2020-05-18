const express = require('express');
const router = express.Router();
const User = require('../models').User
var createError = require('http-errors');
const bcryptjs = require('bcryptjs');
const authenticateUser = require('./middleware/authenticateUser.js');
const asyncHandler = require('./middleware/asyncHandler');

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

router.post("/users", asyncHandler(async(req, res, next) => {
  // parse user credentials
  console.log(req.body);
  try {
    let user = req.body
    console.log(req.body);
    user.password = bcryptjs.hashSync(user.password); 
    const userData = await User.create(user);
    console.log("AWAITED ")
    if (userData) {
      res.location('/').status(201).end();
    } else {
      next();
    }
  } catch(error) {
    console.log("CATCH ERROR")
    if (error.name === "SequelizeValidationError") {
      res.sendStatus(400);
    }
    else {
      next(error);
    }
  }
}));

module.exports = router;