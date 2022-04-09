const { themeModel } = require('../models');
const { newPost } = require('./postController')

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

function subscribe(req, res, next) {
    const themeId = req.params.themeId;
    const { _id: userId } = req.user;
    themeModel.findByIdAndUpdate({ _id: themeId }, { $addToSet: { subscribers: userId } }, { new: true })
        .then(updatedTheme => {
            res.status(200).json(updatedTheme)
        })
        .catch(next);
}

module.exports = {
    getThemes,
    createTheme,
    getTheme,
    subscribe,
}
