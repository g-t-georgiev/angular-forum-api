const express = require('express');
const router = express.Router();
const { auth } = require('../utils');
const { themeController, subscriptionController } = require('../controllers');

// middleware that is specific to this router

router.get('/', themeController.getThemes);
router.post('/', auth(), themeController.createTheme);

router.get('/:themeId', themeController.getTheme);
router.put('/:themeId', themeController.editTheme);
router.delete('/:themeId', themeController.deleteTheme);

router.post('/:themeId/subscribe', auth(), subscriptionController.subscribe);
router.delete('/:themeId/subscribe', auth(), subscriptionController.unsubscribe);

module.exports = router