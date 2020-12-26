const joi = require('@hapi/joi');

const registerValidation = joi.object({
 userName: joi.string()
  .min(6)
  .required(),
 fullName: joi.string()
  .min(6)
  .required(),
 email: joi.string()
  .required(6)
  .email(),
 password: joi.string()
  .min(6)
  .required(),
});

const loginValidation = (requestObj) => {
 const schema = {
  userName: joi.string()
   .min(6)
   .required(),
  password: joi.string()
   .min(6)
   .required(),
 };
 return joi.validate(requestObj,schema);
}

module.exports = {
 registerValidation,
 loginValidation
}
