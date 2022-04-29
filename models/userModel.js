const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const bcrypt = require('bcrypt');
const saltRounds = Number(process.env.SALTROUNDS) || 5;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            /**
             * 
             * @param {String} v 
             * @returns {Boolean}
             */
            validator: function (v) {
                console.log(this);
                return true;
                // return !this.find({ email: v });
            }
        }
    },
    username: {
        type: String,
        required: [true, 'Username is required.'],
        unique: true,
        minlength: [5, 'Username should be at least 5 characters'],
        validate: {
            /**
             * 
             * @param {String} v 
             * @returns {Boolean}
             */
            validator: function (v) {
                return /[a-zA-Z0-9]+/g.test(v);
            },
            message: props => `${props.value} must contains only latin letters and digits!`
        },
    },
    imageUrl: {
        type: String,
        required: [true, 'Image URL is required.'],
        validate: {
            validator: function (v) {
                return /(?=^https?:\/\/).+/.test(value);
            },
            message: props => `${props.value} is not a valid URL address.`
        }
    },
    password: {
        type: String,
        required: true,
        minlength: [5, 'Password should be at least 5 characters'],
        validate: {
            /**
             * 
             * @param {String} v 
             * @returns {Boolean}
             */
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
        if (this.isModified('password')) {
            const salt = await bcrypt.genSalt(saltRounds);
            await bcrypt.hash(this.password, salt);
            next();
        }
        next();
    } catch (err) {
        next(err);
    }
});

const User = model('User', userSchema);

module.exports = User;
