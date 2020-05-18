
/* Handler function to wrap each route. */
/* makes code cleaner by omitting try catch in each route an addditional time */
// const express = require('express');
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      // THIS GETS LOGGED
      console.log(error, "asyncHandler")
      // res.status(500).send(error);
      res.status(500).send(error)
      next();
    }
  }
}

module.exports = asyncHandler;