const mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
 username: {
  type: String,
  required: true,
  min: 6,
  max: 255
 },
 fullname: {
  type: String,
  required: true,
  min: 6,
  max: 255
 },
 email: {
  type: String,
  required: true,
  min: 6,
  max: 255
 },
 uuid: {
  type: String,
  required: true
 },
 date: {
  type: Date,
  default: Date.now
 }
});

//Plugin for passport-local-mongoose
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('user',userSchema);
