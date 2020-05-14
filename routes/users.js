var express = require('express');
var router = express.Router();
var User =require('../models/user');

/* GET users listing. */
router.get('/', (req, res, next) => {
  User.find({})
    .then((users)=>{
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(users);
    }, (err) => next(err))
    .catch((err) => next(err));
});

router.post('/signup', (req, res, next) => {
  User.register(new User({username: req.body.username}), 
    req.body.password, (err, user) => {
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    }
    else {

      if (req.body.fullname)
        user.fullname = req.body.fullname;
      if (req.body.email)
        user.email = req.body.email;

      user.save((err, user) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err: err});
          return ;
        }
        else{
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true, status: 'Registration Successful!'});
        }
      });
    }
  });
});


module.exports = router;
