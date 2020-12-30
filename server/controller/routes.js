const auth = require('./api/auth.js');
const pages = require('./pages.js');

function authEndpoint (app) {
 app.use('/api/user',auth);
}

function pagesEndpoint (app) {
 app.use('/',pages);
}

module.exports = {
 authEndpoint,
 pagesEndpoint
}

