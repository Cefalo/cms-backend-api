const AuthorizationController = require('../controllers/auth.controller');

exports.routesConfig = function (app) {

    app.post('/auth', [
        AuthorizationController.login
    ]);
};