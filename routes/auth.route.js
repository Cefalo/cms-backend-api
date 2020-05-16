const express = require('express');
const router = express.Router();

const AuthorizationController = require('../controllers/auth.controller');
const FieldValidateMiddleware = require("../middlewares/field.validation.middleware");
const AuthValidationMiddleware = require("../middlewares/auth.validation.middleware");

router.post('/auth/token', [
    AuthValidationMiddleware.authFieldValidationRules(), [
        FieldValidateMiddleware.validateRules,
        AuthValidationMiddleware.matchEmailAndPassword
    ], AuthorizationController.login
]);

router.get('/auth/logout', AuthorizationController.logout);

module.exports = router;