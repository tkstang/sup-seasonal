const Joi = require('joi');

module.exports.usersPost = {
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
      .max(12),
    hashed_password: Joi.string()
      .max(20)
      .required()
    }
}

module.exports.foodsPost = {
  body: {
    food_name: Joi.string()
      .alphanum()
      .max(40)
      .required(),
    jan: Joi.boolean(),
    feb: Joi.boolean(),
    mar: Joi.boolean(),
    apr: Joi.boolean(),
    may: Joi.boolean(),
    jun: Joi.boolean(),
    jul: Joi.boolean(),
    aug: Joi.boolean(),
    sep: Joi.boolean(),
    oct: Joi.boolean(),
    nov: Joi.boolean(),
    dec: Joi.boolean()
  }
}
