'use strict';

const Joi = require('joi');

module.exports.message = function isolateErrMessage(err){
	  let errObject = err.errors[0];
	  let field = errObject.field;
	  let message = errObject.messages[0].split(`\" `)[1];
	  let errMessage = `${field}: ${message}`;
	  return errMessage;
}
