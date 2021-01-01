const router = require('express').Router();
var core = require('../core/core');

//Protected routes
router.get('/', async (req,res) => {
 res.send('Hello')
});

//Forwarded if authenticated routes

//Unprotected routes

module.exports = router;
