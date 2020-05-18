'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  class User extends Sequelize.Model {

  }

  User.init({
    firstName: {
	    type: Sequelize.STRING,
      validate: {
        notEmpty: {
	        msg: 'Your first name is required'
          }
        }
    },

    lastName: {
      type: Sequelize.STRING,
        validate: {
          notEmpty: {
	    msg: 'Your first name is required'
          }
        }
    },

    emailAddress: {
      type: Sequelize.STRING,
        validate: {
          isEmail: {
            msg: "please enter in an email format 'address@website.lastpart'"
          }
        },
      unique: {
        args: true,
        msg: 'This email is already in use!'
      },
    },

    password: {
      type: Sequelize.STRING,
      validate: {
        len: [5, 200]
      }
    }}, { sequelize });
    User.associate = (models) => {
      User.hasMany(models.Course, { foreignKey: "userId"});
    };
  return User
};