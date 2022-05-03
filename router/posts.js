const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares');
const { postController, likeController } = require('../controllers');

// middlewares added specific to this router

router.get('/', postController.getLatestsPosts);
router.post('/', authMiddleware(), postController.createPost);
router.put('/:postId', authMiddleware(), postController.editPost);
router.delete('/:postId', authMiddleware(), postController.deletePost);

router.post('/:postId/like', authMiddleware(), likeController.like);
router.delete('/:postId/like', authMiddleware(), likeController.unlike);

module.exports = router