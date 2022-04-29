const authController = require('./auth');
const themeController = require('./theme');
const postController = require('./post');
const userController = require('./user');
const likeController = require('./like');
const subscriptionController = require('./subscription');

module.exports = {
    authController,
    themeController,
    postController,
    userController,
    likeController,
    subscriptionController
}