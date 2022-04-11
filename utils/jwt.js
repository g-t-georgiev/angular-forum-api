const jwt = require('jsonwebtoken');
const secret = process.env.SECRET || 'SoftSecret';

/**
 * 
 * @param {{ [key: String]: any }} data 
 * @param {{ [key: String]: String | Number }} options
 * @returns {Promise<string>}
 */
function createToken(data, options = { expiresIn: '1d' }) {
    return new Promise((resolve, reject) => {
        jwt.sign(data, secret, options, (err, token) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(token);
        });
    });
}


/**
 * 
 * @param {String} token 
 * @returns {Promise<any>}
 */
function verifyToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, data) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(data);
        });
    });
}

module.exports = {
    createToken,
    verifyToken
}