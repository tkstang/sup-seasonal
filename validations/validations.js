const Joi = require('joi');
const ev = require('express-validation');

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
    recipe_id: Joi.number()
    .integer()
    .min(1)
    .required(),
    month: Joi.string()
      .max(3)
    }
}

function isolateErrMessage(err){
	let errObject = err.errors[0];
	let field = errObject.field;
	let message = errObject.messages[0].split(`\" `)[1];
	let errMessage = `${field}: ${message}`;
	return errMessage;
}

module.exports.checkValError = function checkValidationError(err, req, res, next){
  if (err instanceof ev.ValidationError) {
    return res.status(err.status).json(isolateErrMessage(err));
  }
  next();
}
