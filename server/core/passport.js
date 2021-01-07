const LocalStrategy = require('passport-local').Strategy;
const core = require('./core.js');

//Load User model
const User = require('../model/user.js');

module.exports = function(passport) {
 passport.use(
  new LocalStrategy((username, password, callback) => {
  User.findOne({ username: username })
    .then((user) => {
     if (!user) {
      return callback(null, false);
     }
     const isValid = core.validPassword(password, user.hash, user.salt);
     if (isValid) {
      return callback(null, user);
     } else {
      return callback(null, false);
     }
    })
    .catch((err) => {
     callback(err);
    });
  })
 );

 passport.serializeUser(function (user, callback) {
  callback(null, user.uuid);
 });

 passport.deserializeUser(function (uuid, callback) {
  User.findOne({ uuid: uuid })
   .then((user) => {
    if (!user) {
     return callback(err);
    }
    callback(null, user);
   });
 });
};
