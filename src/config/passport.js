const passport = require('passport');
require('./strategies/local.strategies')();

module.exports = function passportConfig(app){
    console.log("iniitalize passport")
    app.use(passport.initialize());
    app.use(passport.session());

    // stores user in session
    passport.serializeUser((user, done) => {
        // done get err first arg and user object/property as second arg
        done(null, user);
    });

    //Retrieves user from session
    passport.deserializeUser((user, done) => {
        // find 
        done(null, user);
    });

    

}