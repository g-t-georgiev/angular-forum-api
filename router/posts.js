const express = require('express');
const router = express.Router();
const { auth } = require('../utils');
const { postController, likeController } = require('../controllers');

// middleware that is specific to this router

router.get('/', postController.getLatestsPosts);
router.post('/', auth(), postController.createPost);
router.put('/:postId', auth(), postController.editPost);
router.delete('/:postId', auth(), postController.deletePost);

router.post('/:postId/like', auth(), likeController.like);
router.delete('/:postId/like', auth(), likeController.unlike);

module.exports = router