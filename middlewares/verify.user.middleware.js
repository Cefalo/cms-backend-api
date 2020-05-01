const {check, validationResult} = require('express-validator');

exports.registrationFieldValidationRules = () => {
    return [
        // firstName should not be empty
        check('firstName', 'firstName empty').notEmpty(),
        // lastName should not be empty
        check('lastName', 'lastName empty').notEmpty(),
        // email should not be empty
        check('email', 'email empty').notEmpty(),
        // email must be valid
        check('email', 'email is not valid').isEmail(),
        // password should not be empty
        check('password', 'password empty').notEmpty(),
        // password must be at least 8 chars long
        check('password', 'password must be at least 8 chars long').isLength({min: 8})
    ]
};

exports.updatePasswordValidationRules = () => {
    return [
        check('email', 'email empty').notEmpty(),
        // email must be valid
        check('email', 'email is not valid').isEmail(),
        // password should not be empty
        check('password', 'password empty').notEmpty(),
        // password must be at least 8 chars long
        check('password', 'password must be at least 8 chars long').isLength({min: 8})
    ]
};

exports.validateRules = (req, res, next) => {
    console.log('req.body: ' + req.body.firstName)
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }

    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({[err.param]: err.msg}));

    return res.status(400).json({
        errors: extractedErrors,
    });
};

