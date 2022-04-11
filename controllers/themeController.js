const { themeModel } = require('../models');
const { newPost } = require('./postController')

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {Callback} next 
 * @returns {void}
 */

function getThemes(req, res, next) {
    themeModel
        // .find(
        //     {}, 
        //     { 
        //         __v: 0
        //     }
        // )
        .aggregate([
            { $match: {} },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    pipeline: [
                        { $project: { username: 1 } }
                    ],
                    as: 'userId'
                }
            },
            { $unwind: '$userId' },
            { 
                $project: {
                    themeName: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    subscribers: 1,
                    userId: '$userId',
                    posts: 1,
                    subscriptions: {
                        $size: '$subscribers'
                    }
                }
            }
        ])
        .sort({ subscriptions: -1 })
        // .populate([
        //     {
        //         path: 'userId',
        //         select: {
        //             username: 1
        //         }
        //     }
        // ])
        .then(themes => res.json(themes))
        .catch(next);
}

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {Callback} next 
 * @returns {void}
 */

function getTheme(req, res, next) {
    const { themeId } = req.params;

    themeModel
        .findById(
            themeId, 
            { 
                __v: 0, 
            }
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
        .then(theme => res.json(theme))
        .catch(next);
}

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {Callback} next 
 * @returns {void}
 */

function createTheme(req, res, next) {
    const { themeName, postText } = req.body;
    const { _id: userId } = req.user;

    themeModel.create({ themeName, userId, subscribers: [userId] })
        .then(theme => {
            newPost(postText, userId, theme._id)
                .then(([_, updatedTheme]) => res.status(200).json(updatedTheme))
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

function subscribe(req, res, next) {
    const { themeId } = req.params;
    const { _id: userId } = req.user;

    // console.log('subscribed to theme ' + themeId);

    themeModel.findByIdAndUpdate({ _id: themeId }, { $addToSet: { subscribers: userId } }, { new: true })
        .then(updatedTheme => {
            res.status(200).json(updatedTheme);
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

function unsubscribe(req, res, next) {
    const { themeId } = req.params;
    const { _id: userId } = req.user;

    // console.log('unsubscribed to theme ' + themeId);

    themeModel.findByIdAndUpdate({ _id: themeId }, { $pull: { subscribers: userId } }, { new: true })
        .then(updatedTheme => {
            res.status(200).json(updatedTheme);
        })
        .catch(next);
}

module.exports = {
    getThemes,
    createTheme,
    getTheme,
    subscribe,
    unsubscribe
}
