const UsersController = require('../controllers/users.controller');
const VerifyUserMiddleware = require('../middlewares/verify.user.middleware');
const appConfig = require('../configs/app.config');

exports.routesConfig = function (app) {
    app.post(`${appConfig.apiEndpointBase}/users`,
        //Pass validation rules
        VerifyUserMiddleware.registrationFieldValidationRules(), [
            //Validate the rule(s)
            VerifyUserMiddleware.validateRules,
            VerifyUserMiddleware.isEmailAlreadyExists
        ],
        //Pass the actual operation middleware
        UsersController.insert);

    app.get(`${appConfig.apiEndpointBase}/users`, [
        UsersController.list
    ]);

    app.get(`${appConfig.apiEndpointBase}/users/:userId`, [
            VerifyUserMiddleware.verifyUserId
        ], UsersController.getById
    );

    app.patch(`${appConfig.apiEndpointBase}/users/:userId`,
        VerifyUserMiddleware.updatePasswordValidationRules(), [
            VerifyUserMiddleware.validateRules,
            VerifyUserMiddleware.verifyUserId
        ], UsersController.patchById);

    app.delete(`${appConfig.apiEndpointBase}/users/:userId`, [
        VerifyUserMiddleware.verifyUserId
    ], UsersController.removeById);
};
