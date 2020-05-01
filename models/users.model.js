const mongoose = require('../services/db.service').mongoose;

const userSchema = new mongoose.Schema({
    firstName: {type: String, required: true, trim: true},
    lastName: {type: String, required: true, trim: true},
    email: {type: String, required: true, trim: true},
    password: {type: String, required: true},
    permissionLevel: {type: Number, default: 1},
    createdAt: {type: Date, default: Date.now},
    lastModified: {type: Date, default: Date.now}
});

const Users = mongoose.model('User', userSchema);

// Rather than exposing Document's _id expose virtual id fields that is derived from _id
// Remember you can not query by virtual fields in Mongoose
// Details - https://mongoosejs.com/docs/tutorials/virtuals.html
userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Serialize virtual fields
userSchema.set('toJSON', {
    virtuals: true
});

userSchema.findById = function (cb) {
    return this.model('User').find({id: this.id}, cb);
};


exports.findByEmail = (email) => {
    return Users.find({email: email});
};

exports.findById = (id) => {
    return Users.findById(id)
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};

exports.createUser = (userData) => {
    const user = new Users(userData);
    return user.save();
};

exports.list = (perPage, page) => {
    return new Promise((resolve, reject) => {
        Users.find()
            .limit(perPage)
            .skip(perPage * page)
            .exec(function (err, users) {
                if (err) {
                    reject(err);
                } else {
                    resolve(users);
                }
            })
    });
};

exports.patchUser = (id, userData) => {
    return new Promise((resolve, reject) => {
        Users.findById(id, function (err, user) {
            if (err) reject(err);
            for (let i in userData) {
                user[i] = userData[i];
            }
            user.save(function (err, updatedUser) {
                if (err) return reject(err);
                resolve(updatedUser);
            });
        });
    })

};

exports.removeById = (userId) => {
    return new Promise((resolve, reject) => {
        Users.remove({_id: userId}, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};
