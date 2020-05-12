const express = require('express');
const logger = require('morgan');

const app = express();


app.get('/', (req, res) => {
    res.send('Hello CMS!')
});

module.exports = app;
