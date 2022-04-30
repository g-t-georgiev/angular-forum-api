const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const bcrypt = require('bcrypt');
const saltRounds = Number(process.env.SALTROUNDS) || 5;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: [true, 'Username is required.'],
        unique: true,
        minlength: [5, 'Username should be at least 4 characters'],
        maxlength: [30, 'Username should not be more than 30 characters long.'],
        validate: {
            validator: function (v) {
                return /(?=[A-Za-z]+)^[A-Za-z0-9]+$/g.test(v);
            },
            message: props => `${props.value} must contains only latin letters and digits!`
        },
    },
    imageUrl: {
        type: String,
        required: [true, 'Image URL is required.'],
        validate: {
            validator: function (v) {
                return /(?=^https?:\/\/).+/.test(v);
            },
            message: props => `${props.value} is not a valid URL address.`
        }
    },
    password: {
        type: String,
        required: true,
        minlength: [5, 'Password should be at least 6 characters'],
        validate: {
            validator: function (v) {
                return /[a-zA-Z0-9]+/g.test(v);
            },
            message: props => `${props.value} must contains only latin letters and digits!`
        },
    }
}, { timestamps: true });

userSchema.methods = {
    matchPassword: function (password) {
        return bcrypt.compare(password, this.password);
    }
}

userSchema.pre('save', async function (next) {
    try {
        if (!this.isModified('password')) {
            next();
            return;
        }

        const salt = await bcrypt.genSalt(saltRounds);
        const hashed = await bcrypt.hash(this.password, salt);
        this.password = hashed;
        next();
    } catch (err) {
        next(err);
    }
});

const User = model('User', userSchema);

module.exports = User;
