const { postModel } = require('../models');

function getLatestsPosts(req, res, next) {
    const limit = Number(req.query.limit) || 0;

    postModel.find({})
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate([
            {
                path: 'authorId',
                select: {
                    username: 1
                }
            }
        ])
        .then(posts => {
            res.status(200).json(posts)
        })
        .catch(next);
}

function createPost(req, res, next) {
    const { _id: userId } = req.user;
    const { text, themeId } = req.body;

    postModel.create({ text, authorId: userId, themeId })
        .then(createdPost => {
            if (createdPost) {
                res.status(201).json({ message: 'Post created successfully!', data: createdPost });
            } else {
                res.status(401).json({ message: 'Not allowed!' });
            }
        })
        .catch(next);
}


function editPost(req, res, next) {
    const { postId } = req.params;
    const { text } = req.body;
    const { _id: userId } = req.user;

    // if the userId is not the same as this one of the post, the post will not be updated
    postModel.findOneAndUpdate({ _id: postId, authorId: userId }, { text }, { new: true })
        .then(updatedPost => {
            if (updatedPost) {
                res.status(201).json({ message: 'Post updated successfully!', data: updatedPost });
            }
            else {
                res.status(401).json({ message: `Not allowed!` });
            }
        })
        .catch(next);
}

function deletePost(req, res, next) {
    const { postId } = req.params;
    const { _id: userId } = req.user;

    // if the userId is not the same as this one of the post, the post will not be deleted
    postModel.findOneAndDelete({ _id: postId, authorId: userId })
        .then(deletedPost => {
            if (deletedPost) {
                res.status(200).json({ message: 'Post deleted successfully!', data: deletedPost });
            } else {
                res.status(401).json({ message: `Not allowed!` });
            }
        })
        .catch(next);
}

module.exports = {
    getLatestsPosts,
    createPost,
    editPost,
    deletePost
}
