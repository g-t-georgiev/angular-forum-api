const {
    userModel,
    tokenBlacklistModel
} = require('../models');

const utils = require('../utils');
const { authCookieName } = require('../app-config');

const bsonToJson = (data) => { return JSON.parse(JSON.stringify(data)) };
const removePassword = (data) => {
    const { password, __v, ...userData } = data;
    return userData
}


function register(req, res, next) {
    const { email, username, imageUrl, password, repeatPassword } = req.body;

    if (password !== repeatPassword) {
        return Promise.reject({ message: 'Passwords do not match!', status: 403 });
    }

    return userModel.create({ email, username, imageUrl, password })
        .then((createdUser) => {
            createdUser = bsonToJson(createdUser);
            createdUser = removePassword(createdUser);

            res.status(201)
                .send({ message: 'Account registered successfully!' });
        })
        .catch(err => {
            if (err.name === 'MongoError' && err.code === 11000) {
                let field = err.message.split("index: ")[1];
                field = field.split(" dup key")[0];
                field = field.substring(0, field.lastIndexOf("_"));

                return next({ message: `This ${field} is already registered!`, status: 409 });
            }
            next(err);
        });
}


function login(req, res, next) {
    const { email, password } = req.body;

    userModel.findOne({ email })
        .then(user => {
            return Promise.all([user, user ? user.matchPassword(password) : false]);
        })
        .then(([user, match]) => {

            if (!match) {
                return Promise.reject({ message: 'Wrong email or password', status: 401 });
            }

            user = bsonToJson(user);
            user = removePassword(user);

            return Promise.all([
                user,
                utils.jwt.createToken({ id: user._id })
            ]);
        })
        .then(([user, token]) => {

            if (process.env.NODE_ENV === 'production') {
                res.cookie(authCookieName, token, { httpOnly: true, sameSite: 'none', secure: true })
            } else {
                res.cookie(authCookieName, token, { httpOnly: true })
            }

            res.status(200)
                .send({ user, message: utils.greet(user.username) });
        })
        .catch(next);
}


function logout(req, res, next) {
    const token = req.cookies[authCookieName];

    tokenBlacklistModel.create({ token })
        .then(() => {
            res.clearCookie(authCookieName)
                .status(200)
                .send({ message: 'Logout successful!' });
        })
        .catch(next);
}

module.exports = {
    login,
    register,
    logout
}
