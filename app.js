var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cors = require('cors');
var passport = require('passport');
var mongoose =require('mongoose');
var config = require('./config');

//routers
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

//connect to db
const connect =mongoose.connect( config.mongoUrl,{
  autoIndex: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

connect.then((db) => {
  console.log("Connected correctly to server");
}, (err) => { console.log(err); });


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());

//routes
app.use('/', indexRouter);
app.use('/user', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  console.log(err)
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
