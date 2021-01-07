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
 hash: {
  type: String,
  required: true
 },
 salt: {
  type: String,
  required: true
 },
 date: {
  type: Date,
  default: Date.now
 }
});

module.exports = mongoose.model('user',userSchema);
