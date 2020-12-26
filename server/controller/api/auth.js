const router = require('express').Router();
const User = require('../../model/user');
var core = require('../../core/core');
const validation = require('../../model/validation');

router.post('/register', async (req,res) => {
 var obj = req.body;
 const {error} = validation.registerValidation.validate(obj);
 if (error) return res.status(400).send({"status":"failure","message":error.details});
 const user = new User({
  userName: obj.fullName,
  fullName: obj.userName,
  email: obj.email,
  password: obj.password
 });
 try{
  const savedUser = await user.save();
  res.status(200).send({"status":"success","message":"User has been successfully created"});
 } catch (err) {
  res.status(400).send({"status":"failure","message":err});
 }
});

router.post('/login', async (req,res) => {
 res.send('Login');
});

module.exports = router;
