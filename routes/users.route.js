const express = require('express');
const router = express.Router();

const UsersController = require('../controllers/users.controller');
const UserValidationMiddleware = require('../middlewares/user.validation.middleware');
const FieldValidateMiddleware = require('../middlewares/field.validation.middleware');
const AuthValidationMiddleware = require("../middlewares/auth.validation.middleware");
const AuthPermissionMiddleware = require("../middlewares/auth.permission.middleware");

router.post('/',
    //Pass validation rules
    UserValidationMiddleware.registrationFieldValidationRules(), [
        //Validate the rule(s)
        FieldValidateMiddleware.validateRules,
        UserValidationMiddleware.isEmailAlreadyExists
    ],
    //Pass the actual operation middleware
    UsersController.insert);

router.get('/', [
    AuthValidationMiddleware.verifyJwtToken,
    AuthPermissionMiddleware.minimumPermissionLevelRequired(process.env.AUTH_PERMISSION_ADMIN)
], UsersController.list);

router.get('/:userId', [
    UserValidationMiddleware.verifyUserId,
    AuthValidationMiddleware.verifyJwtToken,
    AuthPermissionMiddleware.minimumPermissionLevelRequired(process.env.AUTH_PERMISSION_VIEWER),
    AuthPermissionMiddleware.onlySameUserOrAdminCanDoThisAction
], UsersController.getById);

router.patch('/:userId',
    UserValidationMiddleware.updatePasswordValidationRules(), [
        FieldValidateMiddleware.validateRules,
        UserValidationMiddleware.verifyUserId,
        AuthValidationMiddleware.verifyJwtToken,
        AuthPermissionMiddleware.minimumPermissionLevelRequired(process.env.AUTH_PERMISSION_VIEWER),
        AuthPermissionMiddleware.onlySameUserOrAdminCanDoThisAction
    ], UsersController.patchById);

router.delete('/:userId', [
    UserValidationMiddleware.verifyUserId,
    AuthValidationMiddleware.verifyJwtToken,
    AuthPermissionMiddleware.minimumPermissionLevelRequired(process.env.AUTH_PERMISSION_ADMIN),
    AuthPermissionMiddleware.sameUserCantDoThisAction
], UsersController.removeById);

module.exports = router;