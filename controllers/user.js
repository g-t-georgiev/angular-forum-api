const {
    userModel,
    subscriptionModel,
    postModel,
    themeModel,
    likeModel
} = require('../models');

const utils = require('../utils');

function authenticate(req, res) {
    const { user } = req;
    res.status(user ? 200 : 401).send({ user, message: utils.greet(user && user.username) });
}

function getProfileInfo(req, res, next) {
    const { _id: userId } = req.user;

    userModel.findOne({ _id: userId }, { password: 0, __v: 0 }) //finding by Id and returning without password and __v
        .then(user => { res.status(200).json(user) })
        .catch(next);
}

function editProfileInfo(req, res, next) {
    const { _id: userId } = req.user;
    const { username, email } = req.body;

    userModel.findOneAndUpdate({ _id: userId }, { username, email }, { runValidators: true, new: true })
        .then(x => { res.status(200).json(x) })
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

function getUserThemes(req, res, next) {
    const { _id: userId } = req.user;

    themeModel.find({ authorId: userId })
        .then(x => { res.status(200).json(x) })
        .catch(next);
}

function getUserSubscriptions(req, res, next) {
    const { _id: userId } = req.user;

    subscriptionModel.find({ authorId: userId })
        .then(x => { res.status(200).json(x) })
        .catch(next);
}

function getUserPosts(req, res, next) {
    const { _id: userId } = req.user;

    postModel.find({ authorId: userId })
        .then(x => { res.status(200).json(x) })
        .catch(next);
}

function getUserLikes(req, res, next) {
    const { _id: userId } = req.user;

    likeModel.find({ authorId: userId })
        .then(x => { res.status(200).json(x) })
        .catch(next);
}

module.exports = {
    authenticate,
    getProfileInfo,
    editProfileInfo,
    getUserThemes,
    getUserSubscriptions,
    getUserPosts,
    getUserLikes
}