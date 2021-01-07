const router = require('express').Router();
var core = require('../core/core');

//Protected routes
router.get('/test', core.ensureAuthenticated, async (req,res) => {
 res.send('TEST');
});

//Forwarded if authenticated routes

//Unprotected routes
router.get("/", core.forwardAuthenticated, (req, res, next) => {
  const form = '<h1>Login Page</h1><form method="POST" action="/api/user/login">\
    Enter Username:<br><input type="text" name="username">\
    <br>Enter Password:<br><input type="password" name="password">\
    <br><br><input type="submit" value="Submit"></form>';
  res.send(form);
});

router.get("/register", core.forwardAuthenticated, (req, res, next) => {
  const form = '<h1>Register Page</h1><form method="post" action="/api/user/register">\
                    Enter Username:<br><input type="text" name="username">\
                    <br>Enter Password:<br><input type="password" name="password">\
                    <br><br><input type="submit" value="Submit"></form>';
  res.send(form);
});

router.get('/logout', (req,res) => {
 req.logout();
 res.redirect('/');
});

//router.get('/', async (req,res) => {
// res.send('Hello');
//});

module.exports = router;
