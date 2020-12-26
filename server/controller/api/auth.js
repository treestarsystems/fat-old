const router = require('express').Router();

router.post('/register', async (req,res) => {
 res.send('Register');
});

router.post('/login', async (req,res) => {
 res.send('Login');
});

module.exports = router;
