const { subscriptionModel } = require('../models');

 function subscribe(req, res, next) {
    const { themeId } = req.params;
    const { _id: userId } = req.user;

    // console.log('subscribed to theme ' + themeId);

    subscriptionModel.create({ themeId, authorId: userId })
        .then(x => { res.status(200).json({ message: 'Subscribed successfully!', data: x }) })
        .catch(next);
}

function unsubscribe(req, res, next) {
    const { themeId } = req.params;
    const { _id: userId } = req.user;

    // console.log('unsubscribed to theme ' + themeId);

    subscriptionModel.deleteOne({ themeId, authorId: userId })
        .then(x => { res.status(200).json({ message: 'Unsubscribed successfully!', data: x }) })
        .catch(next);
}

module.exports = {
    subscribe,
    unsubscribe
}