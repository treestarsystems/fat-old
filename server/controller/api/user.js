const router = require('express').Router();
const bcrypt = require('bcryptjs');
var core = require('../../core/core');
var system = require('../../../system_confs/system_vars.json');
const validation = require('../../model/validation');
const passport = require('passport');
const jwt = require('jsonwebtoken');
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

  const saltHash = core.genPassword(obj.password);
  const salt = saltHash.salt;
  const hash = saltHash.hash;

 const userObj = new User({
  username: obj.username,
  fullname: obj.fullname,
  email: obj.email,
  uuid: core.uuidv4(),
  hash: hash,
  salt: salt,
 });

 userObj.save()
  .then((user) => {
   res.send({"status":"success","message":"User has been successfully created"});
  })
  .catch((err) => {
   res.send({"status":"failure","message":err});
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

 passport.authenticate('local', (err, user, info) => {
  if (err) return res.json({"status":"failure","message":err});
  req.login(user, (err) => {
   if (err) return res.json({"status":"failure","message":"Username or Password is incorrect"});
   res.json({"status":"success","message":"Login successful"});
  });
 })(req, res);
});

router.post('/profile', async (req,res) => {
 //User sends a task to be done for their account
  //Ex: {task: passwordReset/setDisplayName/setTimeZone}
 //Code needs to take in the user's cookie/session to authenicate and allow them to make changes only to their account/db entry
 res.send(200);
});

module.exports = router;
