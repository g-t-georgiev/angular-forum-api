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
        res.status(403)
            .send({ message: 'Passwords do not match!' });
        return;
    }

    return userModel.create({ email, username, imageUrl, password })
        .then((createdUser) => {
            createdUser = bsonToJson(createdUser);
            createdUser = removePassword(createdUser);

            // const token = utils.jwt.createToken({ id: createdUser._id });
            // if (process.env.NODE_ENV === 'production') {
            //     res.cookie(authCookieName, token, { httpOnly: true, sameSite: 'none', secure: true })
            // } else {
            //     res.cookie(authCookieName, token, { httpOnly: true })
            // }

            res.status(201)
                .send({ message: 'Account registered successfully!' });
        })
        .catch(err => {
            if (err.name === 'MongoError' && err.code === 11000) {
                let field = err.message.split("index: ")[1];
                field = field.split(" dup key")[0];
                field = field.substring(0, field.lastIndexOf("_"));

                res.status(409)
                    .send({ message: `This ${field} is already registered!` });
                return;
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
                res.status(401)
                    .send({ message: 'Wrong email or password' });
                return
            }

            user = bsonToJson(user);
            user = removePassword(user);

            return Promise.all([
                user,
                utils.jwt.createToken({ id: user._id })
            ]);
        })
        .then(([user, token]) => {
            
            console.log('Login action generated token: ', token);

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
