const {check} = require('express-validator');
const crypto = require('crypto');
const UserModel = require('../models/users.model');

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

exports.matchEmailAndPassword = (req, res, next) => {
    const {email, password} = req.body;
    UserModel.findByEmail(email).then(user => {
        if (!user) {
            return res.status(404).send({errors: `User with email:<${email}> doesn't exist`});
        } else {
            let passwordFields = user.password.split('$');
            let salt = passwordFields[0];
            let hash = crypto.createHmac('sha512', salt).update(password).digest("base64");
            if (hash === passwordFields[1]) {
                req.body = {
                    userId: user._id,
                    email: user.email,
                    permissionLevel: user.permissionLevel,
                    provider: 'email',
                    name: `${user.firstName} ${user.lastName}`,
                };
                return next();
            } else {
                return res.status(400).send({errors: 'Invalid e-mail or password'});
            }
        }
    });
};