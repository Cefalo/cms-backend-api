const passport = require('passport');
const { Strategy } = require('passport-local');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { info, error } = require('consola');

const User = require('../../models/User');
const { SECRET } = require('../application');

module.exports = function localStrategy() {
    console.log('get the local stratigy')

    passport.use(new Strategy(
        {
            usernameField: 'userName',
            passwordField: 'password'
        }, (userName, password, done) => {  
           User.findOne({userName}, function (err, user) {
                if (err) { return done(err); }
                if (!user) { return done(err, false);}
                let passMatch = bcrypt.compare(password, user.password);
                if (!passMatch) { return done(null, false); }
                let token = jwt.sign({
                    userid: user._id,
                    role: user.role,
                    name: user.userName,
                    email: user.email
                }, SECRET, {expiresIn: '5 min'});

                let result = {
                    userName: user.userName,
                    email: user.email,
                    fullName: `${user.firstName} ${user.lastName}`,
                    role: user.role,
                    token: `Bearer ${token}`
                }
                return done(null, result);
            });
            
        }
    ));
}