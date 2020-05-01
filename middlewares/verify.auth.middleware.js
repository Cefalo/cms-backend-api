const {check} = require('express-validator');

exports.authFieldValidationRules = () => {
    return [
        // email should not be empty
        check('email', 'email empty').notEmpty(),
        // email must be valid
        check('email', 'email is not valid').isEmail().normalizeEmail(),
        // password should not be empty
        check('password', 'password empty').notEmpty()
    ]
};
