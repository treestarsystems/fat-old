const router = require('express').Router();
var core = require('../core/core');

//Protected routes
router.get('/', core.ensureAuthenticated, async (req,res) => {
 res.send('Hello')
});

//Forwarded if authenticated routes
router.get('/login', core.forwardAuthenticated, (req,res) => {
 res.send(req.user)
});

router.get('/register', core.forwardAuthenticated, async (req,res) => {
 res.send(req.user)
});

//Unprotected routes
router.get('/logout', (req,res) => {
 req.logout();
 res.redirect('/login');
});

module.exports = router;
