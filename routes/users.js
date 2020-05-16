const router = require('express').Router();
const { info, error } = require('consola');
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

router.post('/login', async (req, res) => {
    info({
        message: 'try to login the user',
        badge: true
    });
    try{
        let user = await userLogin(req.body, "editor", res);
        return res.status(200).json(user)
    }catch(err){
        error({
            message: err,
            badge: true
        })
        return res.status(400).json({message: err.message});
    }
});


module.exports = router;