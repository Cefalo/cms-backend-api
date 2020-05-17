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
        validate: {
            validator: function(v) {
                return /[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/.test(v);
            },
            message: props => `${props.value} is not a valid email address!`
        },
        required: [true, 'User email address required']

    },
    password:{
        type:String,
        validate: {
            validator: function(v) {
                return new RegExp('^[a-zA-Z0-9]{3,30}$').test(v);
            },
            message: props => `password is invalid`
        },
        required: [true, 'User password required']
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

//use validation manually before password hashing
UserSchema.set('validateBeforeSave', false);

module.exports = model('users', UserSchema);