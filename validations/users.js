
const Joi = require('joi');

module.exports.post = {
  body: {
    username: Joi.string()
      .alphanum()
      .max(20)
      .required(),
    email: Joi.string()
      .email()
      .max(30)
      .required(),
    permissions: Joi.string()
      .max(12)
  }
    hashed_password: Joi.string()
      .max(20)
      .required()
}
