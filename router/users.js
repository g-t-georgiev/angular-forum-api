const express = require('express');
const router = express.Router();
const { userController } = require('../controllers');
const { auth } = require('../utils');

router.get('/profile', auth(), userController.getProfileInfo);
router.put('/profile', auth(), userController.editProfileInfo);

router.get('/themes', auth(), userController.getUserThemes);
router.get('/posts', auth(), userController.getUserPosts);
router.get('/subscriptions', auth(), userController.getUserSubscriptions);
router.get('/likes', auth(), userController.getUserLikes);

module.exports = router;