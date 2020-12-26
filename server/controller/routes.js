const auth = require('./api/auth.js');

module.exports = function (app) {
 app.use('/api/user',auth);
}

