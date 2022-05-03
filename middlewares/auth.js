const jwt = require('./jwt');
const { authCookieName } = require('../app-config');
const {
    userModel,
    tokenBlacklistModel
} = require('../models');


/**
 * 
 * @param {Boolean} redirectUnauthenticated 
 * @returns {(req: Request, res: Response, next: Function) => void}
 */
function authMiddleware(redirectUnauthenticated = true) {

    /**
     * @param {Request} req
     * @param {Response} res
     * @param {Function} next
     * @returns {void}
     */
    return function (req, res, next) {
        const token = req.cookies[authCookieName] ?? '';
        Promise.all([
            jwt.verifyToken(token),
            tokenBlacklistModel.findOne({ token })
        ])
            .then(([data, blacklistedToken]) => {
                if (blacklistedToken) {
                    return Promise.reject(new Error('blacklisted token'));
                }

                userModel.findById(data.id)
                    .then(user => {
                        req.user = user;
                        req.isLogged = true;
                        next();
                    })
            })
            .catch(err => {
                if (!redirectUnauthenticated) {
                    next();
                    return;
                }

                if ([
                        'token expired', 
                        'blacklisted token', 
                        'jwt must be provided'
                    ].includes(err.message)) {

                    return next({ message: "Invalid token!", status: 401 });
                }

                next(err);
            });
    }
}

module.exports = authMiddleware;