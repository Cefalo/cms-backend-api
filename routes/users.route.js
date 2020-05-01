const UsersController = require('../controllers/users.controller');
const UserValidationMiddleware = require('../middlewares/user.validation.middleware');
const FieldValidateMiddleware = require('../middlewares/field.validation.middleware');
const appConfig = require('../configs/app.config');

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
        UsersController.list
    ]);

    app.get(`${appConfig.apiEndpointBase}/users/:userId`, [
            UserValidationMiddleware.verifyUserId
        ], UsersController.getById
    );

    app.patch(`${appConfig.apiEndpointBase}/users/:userId`,
        UserValidationMiddleware.updatePasswordValidationRules(), [
            FieldValidateMiddleware.validateRules,
            UserValidationMiddleware.verifyUserId
        ], UsersController.patchById);

    app.delete(`${appConfig.apiEndpointBase}/users/:userId`, [
        UserValidationMiddleware.verifyUserId
    ], UsersController.removeById);
};
