const AuthorizationController = require('../controllers/auth.controller');
const FieldValidateMiddleware = require("../middlewares/field.validation.middleware");
const AuthValidationMiddleware = require("../middlewares/auth.validation.middleware");

exports.routesConfig = function (app) {

    app.post('/auth/token', [
        AuthValidationMiddleware.authFieldValidationRules(), [
            FieldValidateMiddleware.validateRules,
            AuthValidationMiddleware.matchEmailAndPassword
        ], AuthorizationController.login
    ]);
};