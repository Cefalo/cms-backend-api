const UsersController = require('../controllers/users.controller');

const UserValidationMiddleware = require('../middlewares/user.validation.middleware');
const FieldValidateMiddleware = require('../middlewares/field.validation.middleware');
const AuthValidationMiddleware = require("../middlewares/auth.validation.middleware");
const AuthPermissionMiddleware = require("../middlewares/auth.permission.middleware");

exports.routesConfig = function (app) {
    app.post(`${process.env.API_ENPOINT_BASE}/users`,
        //Pass validation rules
        UserValidationMiddleware.registrationFieldValidationRules(), [
            //Validate the rule(s)
            FieldValidateMiddleware.validateRules,
            UserValidationMiddleware.isEmailAlreadyExists
        ],
        //Pass the actual operation middleware
        UsersController.insert);

    app.get(`${process.env.API_ENPOINT_BASE}/users`, [
        AuthValidationMiddleware.verifyJwtToken,
        AuthPermissionMiddleware.minimumPermissionLevelRequired(process.env.AUTH_PERMISSION_ADMIN)
    ], UsersController.list);

    app.get(`${process.env.API_ENPOINT_BASE}/users/:userId`, [
        UserValidationMiddleware.verifyUserId,
        AuthValidationMiddleware.verifyJwtToken,
        AuthPermissionMiddleware.minimumPermissionLevelRequired(process.env.AUTH_PERMISSION_VIEWER),
        AuthPermissionMiddleware.onlySameUserOrAdminCanDoThisAction
    ], UsersController.getById);

    app.patch(`${process.env.API_ENPOINT_BASE}/users/:userId`,
        UserValidationMiddleware.updatePasswordValidationRules(), [
            FieldValidateMiddleware.validateRules,
            UserValidationMiddleware.verifyUserId,
            AuthValidationMiddleware.verifyJwtToken,
            AuthPermissionMiddleware.minimumPermissionLevelRequired(process.env.AUTH_PERMISSION_VIEWER),
            AuthPermissionMiddleware.onlySameUserOrAdminCanDoThisAction
        ], UsersController.patchById);

    app.delete(`${process.env.API_ENPOINT_BASE}/users/:userId`, [
        UserValidationMiddleware.verifyUserId,
        AuthValidationMiddleware.verifyJwtToken,
        AuthPermissionMiddleware.minimumPermissionLevelRequired(process.env.AUTH_PERMISSION_ADMIN),
        AuthPermissionMiddleware.sameUserCantDoThisAction
    ], UsersController.removeById);
};
