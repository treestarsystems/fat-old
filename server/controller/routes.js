const user = require('./api/user.js');
const pages = require('./pages.js');

function userEndpoint (app) {
 app.use('/api/user',user);
}

function pagesEndpoint (app) {
 app.use('/',pages);
}

module.exports = {
 userEndpoint,
 pagesEndpoint
}

