const { themeModel } = require('../models');

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {Callback} next 
 * @returns {void}
 */

function getThemes(req, res, next) {
    themeModel.find({})
        .sort({ subscribers: -1 })
        .populate([
            {
                path: 'authorId',
                select: {
                    username: 1
                }
            }
        ])
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

    themeModel.findById(themeId)
        .populate([
            {
                path: 'posts',
                select: {
                    __v: 0
                },
                populate: {
                path: 'authorId',
                select: {
                    username: 1,
                }
                }
            },
            {
                path: 'subscribers'
            }
        ])
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
    const { title } = req.body;
    const { _id: userId } = req.user;

    themeModel.create({ title, authorId: userId })
        .then(theme => { res.status(201).json(theme) })
        .catch(next);
}

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {Callback} next 
 * @returns {void}
 */

function editTheme(req, res, next) {
    const { title } = req.body;
    const { themeId } = req.params;
    const { _id: userId } = req.user;

    // if the userId is not the same as this one of the post, the post will not be deleted
    postModel.findOneAndDelete({ _id: postId, authorId: userId })
    themeModel.findByIdAndUpdate(themeId, { title }, { new: true })
        .then(updatedTheme => {
            if (updatedTheme) {
                res.status(201).json({ message: 'Updated theme successfully!', data: x });
            } else {
                res.status(401).json({ message: 'Not allowed!' });
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

 function deleteTheme(req, res, next) {
    const { title } = req.body;
    const { themeId } = req.params;
    const { _id: userId } = req.user;

    // if the userId is not the same as this one of the post, the post will not be deleted
    postModel.findOneAndDelete({ _id: postId, authorId: userId })
    themeModel.findByIdAndDelete(themeId, { title }, { new: true })
        .then(deletedTheme => {
            if (deletedTheme) {
                res.status(201).json({ message: 'Deleted theme successfully!', data: x });
            } else {
                res.status(401).json({ message: 'Not allowed!' });
            }
        })
        .catch(next);
}

module.exports = {
    getThemes,
    createTheme,
    getTheme,
    editTheme,
    deleteTheme
}
