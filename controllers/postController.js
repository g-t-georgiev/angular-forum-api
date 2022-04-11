const { userModel, themeModel, postModel } = require('../models');

/**
 * 
 * @param {String} text 
 * @param {String} userId 
 * @param {String} themeId 
 * @returns {void}
 */

function newPost(text, userId, themeId) {
    return postModel.create({ text, userId, themeId })
        .then(post => {
            return Promise.all([
                userModel.updateOne({ _id: userId }, { $push: { posts: post._id }, $addToSet: { themes: themeId } }),
                themeModel
                    .findByIdAndUpdate(
                        { _id: themeId }, 
                        { $push: { posts: post._id }, 
                        $addToSet: { subscribers: userId } }, 
                        { new: true }
                    )
                    .populate({
                        path: 'posts',
                        select: {
                            __v: 0
                        },
                        populate: {
                          path: 'userId',
                          select: {
                            username: 1,
                          }
                        }
                    })
            ])
        })
}

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {Callback} next 
 * @returns {void}
 */

function getLatestsPosts(req, res, next) {
    const limit = Number(req.query.limit) || 0;

    postModel
        .find(
            {}, 
            { 
                __v: 0, 
                likes: 0 
            }
        )
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate([
            {
                path: 'themeId',
                select: {
                    themeName: 1
                }
            },
            {
                path: 'userId',
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

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {Callback} next 
 * @returns {void}
 */

function createPost(req, res, next) {
    const { themeId } = req.params;
    const { _id: userId } = req.user;
    const { postText } = req.body;

    newPost(postText, userId, themeId)
        .then(([_, updatedTheme]) => res.status(200).json(updatedTheme))
        .catch(next);
}

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {Callback} next 
 * @returns {void}
 */

function editPost(req, res, next) {
    const { postId } = req.params;
    const { postText } = req.body;
    const { _id: userId } = req.user;

    // if the userId is not the same as this one of the post, the post will not be updated
    postModel.findOneAndUpdate({ _id: postId, userId }, { text: postText }, { new: true })
        .then(updatedPost => {
            if (updatedPost) {
                res.status(200).json(updatedPost);
            }
            else {
                res.status(401).json({ message: `Not allowed!` });
            }
        })
        .catch(next);
}

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {Callback} next 
 * @returns {void}
 */

function deletePost(req, res, next) {
    const { postId, themeId } = req.params;
    const { _id: userId } = req.user;

    Promise.all([
        postModel.findOneAndDelete({ _id: postId, userId }),
        userModel.findOneAndUpdate({ _id: userId }, { $pull: { posts: postId } }),
        themeModel.findOneAndUpdate({ _id: themeId }, { $pull: { posts: postId } }),
    ])
        .then(([deletedOne, _, __]) => {
            if (deletedOne) {
                res.status(200).json(deletedOne)
            } else {
                res.status(401).json({ message: `Not allowed!` });
            }
        })
        .catch(next);
}

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {Callback} next 
 * @returns {void}
 */

function like(req, res, next) {
    const { postId } = req.params;
    const { _id: userId } = req.user;

    // console.log('like');

    postModel.updateOne({ _id: postId }, { $addToSet: { likes: userId } }, { new: true })
        .then(() => res.status(200).json({ message: 'Liked successful!' }))
        .catch(next);
}

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {Callback} next 
 * @returns {void}
 */

function unlike(req, res, next) {
    const { postId } = req.params;
    const { _id: userId } = req.user;

    // console.log('unlike');

    postModel.updateOne({ _id: postId }, { $pull: { likes: userId } }, { new: true })
        .then(() => res.status(200).json({ message: 'Unliked successfull!' }))
        .catch(next);
}

module.exports = {
    getLatestsPosts,
    newPost,
    createPost,
    editPost,
    deletePost,
    like,
    unlike
}
