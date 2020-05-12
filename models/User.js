const { Schema, model } = require('mongoose');


const UserSchema = new Schema({
    firstName:{
        type:String
    },
    lastName:{
        type:String
    },
    userName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        default:'editor',
        enum: ['admin', 'editor']
    },
    status:{
        type:String,
        default:'new',
        enum:['new', 'verified']
    }
}, {timestamps: true});

module.exports = model('users', UserSchema);