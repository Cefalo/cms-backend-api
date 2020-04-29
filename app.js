const express = require('express');
const logger = require('morgan');

const app = express();

app.get('/', (req, res) => {
    res.send('Hello CMS!')
});

app.listen(3000, () => {
    console.log('Server started and listening on PORT: 3000');
});