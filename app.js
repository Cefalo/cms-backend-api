var debug = require('debug')('cms-backend-api:*');
var express = require('express');
var logger = require('morgan');
var mongoose=require('mongoose');

//custom modules
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var articleRouter = require('./routes/article');

//connect to database
var connect = mongoose.connect(process.env.DB_URL,{
    autoIndex: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

connect.then((db) => {
    debug('Connected to database ' + process.env.DB_URL);
}, (err) => { console.log(err); });

const bodyParser = require('body-parser');

const authRouter = require('./routes/auth.route');
const usersRouter = require('./routes/users.route');
const binaryRouter=require('./routes/binaries.route');

const app = express();

//middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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

//List all the routes
app.use('/auth', authRouter);
app.use(`${process.env.API_ENPOINT_BASE}/users`, usersRouter);
app.use(`${process.env.API_ENPOINT_BASE}/binaries`, binaryRouter);
app.use('/article', articleRouter);

app.get(process.env.API_ENPOINT_BASE, (req, res) => {
    res.send(`CMS API v1.`)
});

module.exports = app;
