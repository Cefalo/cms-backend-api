const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { success, error, info } = require('consola');

const { SECRET } = require('../config/application');

/**
 * @DESC To register the user
 */

 const userRegistration = async(userDets, res) => {
        //validate username
        info({message: `Check is username: ${userDets.userName} already taken?`, badge:true})
        const usernametaken = await validateUsername(userDets.userName);
        if(usernametaken) {                        
            throw new Error("Username already taken");
        }

        const hashPassword = await bcrypt.hash(userDets.password, 12);
        const newUser = new User({
            ...userDets
            
        });

        
        // validate all field befor hashed the password
        await newUser.validate();

        newUser.password = hashPassword;

        await newUser.save();
        
        success({
            message: `successfully created user with username: ${newUser.userName}`,
            badge: true
        })
        return {userName: newUser.userName, email: newUser.email, fullName: `${newUser.firstName} ${newUser.lastName}` };

 }

 const userLogin = async (userCreds, role, res) => {
     let {userName, password} = userCreds;

     //check is userName exists
     const user = await User.findOne({userName});
     if(!user){
         throw new Error(`No user found. Invalid login credentials.`)
     }

     //check role
     if(user.role !== role){
         throw new Error(`Please make sure you are loging in from the right portal`);
     }

     //matche password
     let passMatch = await bcrypt.compare(password, user.password);
     if(passMatch){
         //sign the token and issue it to the user
         let token = jwt.sign({
             userid: user._id,
             role: user.role,
             name: user.userName,
             email: user.email
         }, SECRET, {expiresIn: '5 min'});

         return {
            userName: user.userName,
            role: user.role,
            email: user.email,
            token: `Bearer ${token}`,
            expiresIn: 5
        }

     }else{
        throw new Error(`Incorrect password.`)
     }

 }

 const validateUsername = async(userName) => {
     let user = await User.findOne({userName});
     return user ? true : false;
 };



module.exports = { userRegistration, userLogin }