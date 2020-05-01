const AuthorizationController = require('../controllers/auth.controller');
const FieldValidateMiddleware = require("../middlewares/field.validate.middleware");
const VerifyAuthMiddleware = require("../middlewares/verify.auth.middleware");

exports.routesConfig = function (app) {

    app.post('/auth/token', [
        VerifyAuthMiddleware.authFieldValidationRules(),
        [FieldValidateMiddleware.validateRules],
        AuthorizationController.login
    ]);
};