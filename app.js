const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const UsersRouter = require('./routes/users.route');
const appConfig = require('./configs/app.config');
const app = express();

app.use(logger('combined'));

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
    if (req.method === 'OPTIONS') {
        return res.send(200);
    } else {
        return next();
    }
});

app.use(bodyParser.json());
UsersRouter.routesConfig(app);

app.get(appConfig.apiEndpointBase, (req, res) => {
    res.send(`CMS API ${appConfig.apiVersion}. RUN command <curl -I localhost:${appConfig.port}> for details.`)
});

module.exports = app;