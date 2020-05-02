const UsersController = require('../controllers/users.controller');

const UserValidationMiddleware = require('../middlewares/user.validation.middleware');
const FieldValidateMiddleware = require('../middlewares/field.validation.middleware');
const AuthValidationMiddleware = require("../middlewares/auth.validation.middleware");
const AuthPermissionMiddleware = require("../middlewares/auth.permission.middleware");

const appConfig = require('../configs/app.config');
const authConfig = require('../configs/auth.config');


exports.routesConfig = function (app) {
    app.post(`${appConfig.apiEndpointBase}/users`,
        //Pass validation rules
        UserValidationMiddleware.registrationFieldValidationRules(), [
            //Validate the rule(s)
            FieldValidateMiddleware.validateRules,
            UserValidationMiddleware.isEmailAlreadyExists
        ],
        //Pass the actual operation middleware
        UsersController.insert);

    app.get(`${appConfig.apiEndpointBase}/users`, [
        AuthValidationMiddleware.verifyJwtToken,
        AuthPermissionMiddleware.minimumPermissionLevelRequired(authConfig.permissionLevels.ADMIN)
    ], UsersController.list);

    app.get(`${appConfig.apiEndpointBase}/users/:userId`, [
        UserValidationMiddleware.verifyUserId,
        AuthValidationMiddleware.verifyJwtToken,
        AuthPermissionMiddleware.minimumPermissionLevelRequired(authConfig.permissionLevels.VIEWER),
        AuthPermissionMiddleware.onlySameUserOrAdminCanDoThisAction
    ], UsersController.getById);

    app.patch(`${appConfig.apiEndpointBase}/users/:userId`,
        UserValidationMiddleware.updatePasswordValidationRules(), [
            FieldValidateMiddleware.validateRules,
            UserValidationMiddleware.verifyUserId,
            AuthValidationMiddleware.verifyJwtToken,
            AuthPermissionMiddleware.minimumPermissionLevelRequired(authConfig.permissionLevels.VIEWER),
            AuthPermissionMiddleware.onlySameUserOrAdminCanDoThisAction
        ], UsersController.patchById);

    app.delete(`${appConfig.apiEndpointBase}/users/:userId`, [
        UserValidationMiddleware.verifyUserId,
        AuthValidationMiddleware.verifyJwtToken,
        AuthPermissionMiddleware.minimumPermissionLevelRequired(authConfig.permissionLevels.ADMIN),
        AuthPermissionMiddleware.sameUserCantDoThisAction
    ], UsersController.removeById);
};
