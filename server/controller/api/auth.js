const router = require('express').Router();
const bcrypt = require('bcryptjs');
var core = require('../../core/core');
var system = require('../../../system_confs/system_vars.json');
const validation = require('../../model/validation');
const passport = require('passport');
const User = require('../../model/user');

router.post('/register', async (req,res) => {
 var obj = req.body;
 //Validate input
 const {error} = validation.registerValidation.validate(obj,{abortEarly:false});
 if (error) return res.status(400).send({"status":"failure","message":error.details});
 //Check if username or Email exists
 const userExists = await User.findOne({username: obj.username});
 if (userExists) return res.status(400).send({"status":"failure","message":"Username exists"});
 const emailExists = await User.findOne({email: obj.email});
 if (emailExists) return res.status(400).send({"status":"failure","message":"Email exists"});
 //Password match
 if (obj.password != obj.passwordRepeat) return res.status(400).send({"status":"failure","message":"Passwords do not match."});

 const userObj = new User({
  username: obj.username,
  fullname: obj.fullname,
  email: obj.email,
  uuid: core.uuidv4()
 });

 User.register(userObj, obj.password, (err, user) => {
  if (err) {
   res.send({"status":"failure","message":err.message})
  }else{
   res.send({"status":"success","message":"User has been successfully created"})
  }
 });
});

router.post('/login', async (req,res) => {
 var obj = req.body;
 //Validate input
 const {error} = validation.loginValidation.validate(obj,{abortEarly:false});
 if (error) return res.status(400).send({"status":"failure","message":error.details});
 //Check if Username
 const userExists = await User.findOne({username: obj.username});
 if (!userExists) return res.status(400).send({"status":"failure","message":"Username or Password is incorrect"});
 passport.authenticate('local', {
   successRedirect: '/'
  }, (err, user, info) => {
   if (err) return res.send({"status":"failure","message":"Username or Password is incorrect"});
   res.redirect('/');
  }
 )(req, res);
});

module.exports = router;
