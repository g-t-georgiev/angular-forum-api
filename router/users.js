const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares');
const { userController } = require('../controllers');

// middlewares added specific to this router

router.get('/auth', authMiddleware(false), userController.authenticate);

router.get('/profile', authMiddleware(), userController.getProfileInfo);
router.put('/profile', authMiddleware(), userController.editProfileInfo);

router.get('/themes', authMiddleware(), userController.getUserThemes);
router.get('/posts', authMiddleware(), userController.getUserPosts);
router.get('/subscriptions', authMiddleware(), userController.getUserSubscriptions);
router.get('/likes', authMiddleware(), userController.getUserLikes);

module.exports = router;