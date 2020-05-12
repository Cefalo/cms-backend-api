const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { success, error, info } = require('consola');

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
            ...userDets,
            password: hashPassword
        });

        await newUser.save();
        
        success({
            message: `successfully created user with username: ${newUser.userName}`,
            badge: true
        })
        return {userName: newUser.userName, email: newUser.email, fullName: `${newUser.firstName} ${newUser.lastName}` };

 }

 const validateUsername = async(userName) => {
     let user = await User.findOne({userName});
     return user ? true : false;
 };



module.exports = { userRegistration}