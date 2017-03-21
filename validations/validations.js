const Joi = require('joi');

module.exports.usersPost = {
  body: {
    username: Joi.string()
      .label('username')
      .alphanum()
      .max(20)
      .required(),
    email: Joi.string()
      .label('e-mail')
      .email()
      .max(30)
      .required(),
    permissions: Joi.string()
      .label('permissions')
      .max(12),
    hashed_password: Joi.string()
      .label('hashed password')
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

module.exports.favoritesPost = {
  body: {
    user_id: Joi.number()
      .integer()
      .min(1)
      .required(),
    recipe_id: Joi.number()
      .integer()
      .min(1)
      .required(),
    permissions: Joi.string()
      .min(3)
      .max(10)
      .required()
    }
}
