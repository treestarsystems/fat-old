const joi = require('joi');

const registerValidation = joi.object({
 username: joi.string()
  .alphanum()
  .min(6)
  .label('Username')
  .required(),
 fullname: joi.string()
  .min(6)
  .label('Full name')
  .required(),
 email: joi.string()
  .required(6)
  .label('Email')
  .email(),
 password: joi.string()
  .min(6)
  .label('Passowrd')
  .required(),
 passwordRepeat: joi.string()
  .min(6)
  .label('Repeated Passowrd')
  .required()
})

const loginValidation = joi.object({
 username: joi.string()
  .min(6)
  .label('Username')
  .required(),
 password: joi.string()
  .min(6)
  .label('Passowrd')
  .required(),
});

module.exports = {
 registerValidation,
 loginValidation
}
