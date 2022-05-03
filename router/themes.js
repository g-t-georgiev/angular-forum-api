const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares');
const { themeController, subscriptionController } = require('../controllers');

// middlewares added specific to this router

router.get('/', themeController.getThemes);
router.post('/', authMiddleware(), themeController.createTheme);

router.get('/:themeId', themeController.getTheme);
router.put('/:themeId', themeController.editTheme);
router.delete('/:themeId', themeController.deleteTheme);

router.post('/:themeId/subscribe', authMiddleware(), subscriptionController.subscribe);
router.delete('/:themeId/subscribe', authMiddleware(), subscriptionController.unsubscribe);

module.exports = router