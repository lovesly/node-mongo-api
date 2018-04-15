const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

// schema??
const UserSchema = new mongoose.Schema({
    // the use of tokens?
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email',
        },
    },
    password: {
        type: String,
        require: true,
        minlength: 6,
    },
    tokens: [{
        access: {
            type: String,
            required: true,
        },
        token: {
            type: String,
            required: true,
        },
    }],
});

// eslint-disable-next-line
UserSchema.methods.generateAuthToken = function() {
    const user = this;
    const access = 'auth';
    const token = jwt.sign({ _id: user._id.toHexString(), access }, process.env.JWT_SECRET).toString();
    // user.tokens.push(token);
    // interesting, tokens add a _id automatically.
    user.tokens = user.tokens.concat([{ access, token }]);
    return user.save().then(() => {
        return token;
    });
};

// eslint-disable-next-line
UserSchema.methods.toJSON = function() {
    const user = this;
    // transform mongoose variable to a normal obj
    const userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
};

// eslint-disable-next-line
UserSchema.methods.removeToken = function(token) {
    const user = this;
    return user.update({
        $pull: {
            tokens: {
                token,
            },
        },
    });
};

// eslint-disable-next-line
UserSchema.statics.findByToken = function(token) {
    const User = this;
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
        // console.log(e);
        return Promise.reject();
    }
    // the built-in toJSON
    // is called inside somewhere res.send();
    // so we are actually override the toJSON method to hide some data.
    return User.findOne({
        _id: decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth',
    });
};

// eslint-disable-next-line
UserSchema.statics.findByCrendentials = function(email, password) {
    const User = this;
    return User.findOne({ email }).then((user) => {
        if (!user) {
            return Promise.reject();
        }
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    resolve(user);
                } else {
                    reject();
                }
            });
        });
    });
};

// eslint-disable-next-line
UserSchema.pre('save', function(next) {
    const user = this;
    if (user.isModified('password')) {
        const { password } = user;
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = { User };
