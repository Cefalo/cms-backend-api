const UsersController = require('../controllers/users.controller');
const appConfig = require('../configs/app.config');

exports.routesConfig = function (app) {
    app.post(`${appConfig.apiEndpointBase}/users`, [
        UsersController.insert
    ]);
    app.get(`${appConfig.apiEndpointBase}/users`, [
        UsersController.list
    ]);
    app.get(`${appConfig.apiEndpointBase}/users/:userId`, [
        UsersController.getById
    ]);
    app.patch(`${appConfig.apiEndpointBase}/users/:userId`, [
        UsersController.patchById
    ]);
    app.delete(`${appConfig.apiEndpointBase}/users/:userId`, [
        UsersController.removeById
    ]);
};
