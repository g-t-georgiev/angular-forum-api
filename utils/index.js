const jwt = require('./jwt');
const auth = require('./auth');
const errorHandler = require('./errHandler');
const greet = require('./greetingHandler');

module.exports = {
    jwt,
    auth,
    errorHandler,
    greet
}
