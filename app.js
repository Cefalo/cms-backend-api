var debug = require('debug')('cms-backend-api:*');
var express = require('express');
var logger = require('morgan');
var mongoose=require('mongoose');

//custom modules
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

//connect to database
var connect = mongoose.connect(process.env.DB_URL,{
    autoIndex: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

connect.then((db) => {
    debug('Connected to database ' + process.env.DB_URL);
}, (err) => { console.log(err); });



var app = express();

//middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//routes
app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
