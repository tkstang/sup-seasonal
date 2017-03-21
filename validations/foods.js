'use strict';

const Joi = require('joi');

module.exports.post = {
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
