const express = require('express');
const logger = require('morgan');
const config = require('./configs/app.config');
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

app.get(config.apiEndpointBase, (req, res) => {
    res.send(`CMS API ${config.apiVersion}. RUN command <curl -I localhost:3000> for details.`)
});

module.exports = app;