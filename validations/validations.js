const Joi = require('joi');

module.exports.usersRegister = {
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
    password: Joi.string()
    .label('password')
    .max(20)
    .min(8)
    .required()
  }
}

module.exports.usersLogin = {
  body: {
    email: Joi.string()
    .label('e-mail')
    .email()
    .max(30)
    .required(),
    password: Joi.string()
    .label('password')
    .max(20)
    .min(8)
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
    .required(),
    month: Joi.string()
      .max(3)
    }
}
