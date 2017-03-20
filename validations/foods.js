'use strict';

const Joi = require('joi');

module.exports.post = {
  body: {
    food_name: Joi.string()
      .alphanum()
      .max(40)
      .required();
  }
}
