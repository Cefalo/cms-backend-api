const mongoose=require('mongoose');
const Schema=mongoose.Schema;

var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    firstname: {
        type: String,
        default: ''
    },
    lastname: {
        type: String,
        default: ''
    },
    email:   {
        type: String,
        default: ''
    }
});

User.plugin(passportLocalMongoose,{
    usernameLowerCase:true,
    passwordValidator : (password,cb)=>{
        if (!password.trim()) {
            return cb('Password can not be empty!');
        }else if(password.trim().length<8){
            return cb('Password must be at least 8 chars long');
        }
        // return an empty cb() on success
        return cb()
      }
});

module.exports = mongoose.model('User', User);