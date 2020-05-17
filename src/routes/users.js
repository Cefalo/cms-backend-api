const router = require('express').Router();
const { info, error } = require('consola');
const passport = require('passport');
const { userRegistration, userLogin } = require('../utils/Auth')

router.post('/register', async (req, res)=>{
    info({
        message: 'start to create new user',
        badge: true
    })
    try{
        let newUser = await userRegistration(req.body, res);
        return res.status(201).json(newUser)
    }catch(err){
        error({
            message: err,
            badge: true
        })
        return res.status(400).json({message: err.message});
    }
    
});

router.post('/login',  passport.authenticate('local'), (req, res) => {
    info({
        message: `Successfully logged in username: ${req.user.userName}`,
        badge: true
    });

    res.status(200).json(req.user)
});


router.get('/profile', (req, res)=>{
    return res.json("Hello")
})


module.exports = router;