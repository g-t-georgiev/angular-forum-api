const { postModel } = require('../models');

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

    postModel.create({ postId, authorId: userId })
        .then((x) => { res.status(200).json({ message: 'Liked successfully!', data: x }) })
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

    postModel.deleteOne({ postId, authorId: userId })
        .then((x) => res.status(200).json({ message: 'Unliked successfully!', data: x }))
        .catch(next);
}

module.exports = {
    like,
    unlike
}