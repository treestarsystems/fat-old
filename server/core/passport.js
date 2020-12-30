const LocalStrategy = require('passport-local').Strategy;
//const bcrypt = require('bcryptjs');

//Load User model
const user = require('../model/user');

module.exports = function(passport) {
 passport.use(new LocalStrategy(user.authenticate()));
/*
 passport.use(new LocalStrategy({ usernameField: 'userName', passwordField: 'password' }, (username, password, done) => {
  // Match user
  User.findOne({
   userName: username
  }).then(user => {
   if (!user) {
    return done(null, false, { message: 'That email is not registered' });
   }
   // Match password
   bcrypt.compare(password, user.password, (err, isMatch) => {
    if (err) throw err;
    if (isMatch) {
     return done(null, user);
    } else {
     return done(null, false, { message: 'Password incorrect' });
    }
   });
  });
 }));

 passport.serializeUser(function(user, done) {
  done(null, user.id);
 });

 passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
   done(err, user);
  });
 });
*/
};
