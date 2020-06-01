const express = require('express');
const router = express.Router();
const Course = require('../models').Course;
//const User = require('../models').User
var createError = require('http-errors');
const authenticateUser = require('./middleware/authenticateUser');
const asyncHandler = require('./middleware/asyncHandler');
const { check, validationResult } = require('express-validator');

const { courseValidation } = require('./middleware/courseVal');
//const Sequelize = require('sequelize');
// import the database so that raw queries are available
// sequelize CLI index.js file exposes these methods
const db = require('../models');


router.get('/courses', asyncHandler(async (req, res) => {
  //  find course info and teacher names
  courses = await db.sequelize.query("SELECT Users.firstName, Users.lastName, Users.emailAddress, Courses.title,  Courses.estimatedTime, Courses.materialsNeeded, Courses.description, Courses.id AS courseID FROM Users, Courses WHERE Users.id = Courses.userId");
  result =  await courses[0]
  res.json({result})
}));


// GET /api/courses/:id 200 - (including the user that owns the course) for the provided course ID

router.get('/courses/:id', asyncHandler(async (req, res) => {
  course = await Course.findByPk(req.params.id);
  res.json({course})
}));

//POST /api/courses 201 - Creates a course, sets the Location header to the URI for the course, and returns no content

router.post('/courses',[ courseValidation], authenticateUser, asyncHandler(async (req, res, next) => {
  // check validation 
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    // send status of 400 with the error messages
    res.status(400).json({ errors: errorMessages });
  }

  let course;
  try {
    // create the course
    // userId comes from authenticatUser
    course = await Course.create({
      title: req.body.title,
      description: req.body.description,
      estimatedTime: req.body.estimatedTime,
      materialsNeeded: req.body.materialsNeeded,
      userId: req.currentUser.id,
    });
    if (course) {
      res.location(`/courses/${course.id}`).status(201).end();
    }
    else {
      res.status(400);
    } 
  }
  catch (error) {
    if (error.name === "SequelizeValidationError") {
      res.sendStatus(400);
    }
    else {
      next(error);
    }
  }
}));


// PUT /api/courses/:id 204 - Updates a course and returns no content
router.put('/courses/:id', [courseValidation] , authenticateUser, asyncHandler(async (req, res, next) => {
  // check validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    return res.status(400).json({errors: errorMessages})
  }
  try {
  course = await Course.findByPk(req.params.id);
  if (course) {
    if (course.userId === req.currentUser.id) {

    
    course.update(req.body);
    res.status(204).end();
    } else {
      res.status(403).end();
    }
  }
  else {
    next();
  }
}
catch (error) {
  if (error.name === "SequelizeValidationError") {
    res.sendStatus(400);
  }
  else {
    next(error);
  }
}
}));

// DELETE /api/courses/:id 204 - Deletes a course and returns no content

router.delete('/courses/:id', authenticateUser, asyncHandler(async (req, res, next) => {
  try {
    course = await Course.findByPk(req.params.id);
    if (course) {
      if (course.userId === req.currentUser.id) {
      await course.destroy()
      res.status(204).end();
    } else {
      res.status(403).end();
    }

    }
    else {
      next();
    }
  } catch (error) {
    next(error);
  }
}));
// export the router
module.exports = router;