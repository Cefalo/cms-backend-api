const mongoose = require('../services/db.service').mongoose
const UserModel = require('../models/users.model')

const { check } = require('express-validator')

exports.registrationFieldValidationRules = () => {
  return [
    // firstName should not be empty
    check('firstName', 'firstName empty').notEmpty(),
    // lastName should not be empty
    check('lastName', 'lastName empty').notEmpty(),
    // email should not be empty
    check('email', 'email empty').notEmpty(),
    // email must be valid
    check('email', 'email is not valid').isEmail().normalizeEmail(),
    // password should not be empty
    check('password', 'password empty').notEmpty(),
    // password must be at least 8 chars long
    check('password', 'password must be at least 8 chars long').isLength({
      min: 8,
    }),
  ]
}

exports.isEmailAlreadyExists = (req, res, next) => {
  UserModel.findByEmail(req.body.email)
    .then((result) => {
      if (result) {
        return res.status(409).json({ message: 'Email already in use.' })
      } else {
        return next()
      }
    })
    .catch((err) => res.status(500).json({ errors: err }))
}

exports.verifyUserId = (req, res, next) => {
  if (req.params.userId && mongoose.Types.ObjectId.isValid(req.params.userId)) {
    return next()
  }

  return res.sendStatus(404)
}

exports.updatePasswordValidationRules = () => {
  return [
    check('email', 'email empty').notEmpty(),
    // email must be valid
    check('email', 'email is not valid').isEmail().normalizeEmail(),
    // password should not be empty
    check('password', 'password empty').notEmpty(),
    // password must be at least 8 chars long
    check('password', 'password must be at least 8 chars long').isLength({
      min: 8,
    }),
  ]
}
