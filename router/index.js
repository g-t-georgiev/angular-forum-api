const router = require('express').Router();

const users = require('./users');
const themes = require('./themes');
const posts = require('./posts');

const { authController } = require('../controllers');
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

router.use('/users', users);
router.use('/themes', themes);
router.use('/posts', posts);

module.exports = router;
