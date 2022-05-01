const userModel = require('./user');
const tokenBlacklistModel = require('./tokenBlacklist');
const themeModel = require('./theme');
const postModel = require('./post');
const likeModel = require('./like');
const subscriptionModel = require('./subscription');

module.exports = {
    userModel,
    tokenBlacklistModel,
    themeModel,
    postModel,
    likeModel,
    subscriptionModel
}