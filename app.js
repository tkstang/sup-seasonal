'use strict';

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
const bodyParser = require('body-parser');
const ev = require('express-validation');
const Joi = require('joi');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
module.exports = app; // for testing

var config = {
  appRoot: __dirname // required config
};

const usersPost = {
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

const usersValMiddleware = ev(usersPost);

app.post('/users', usersValMiddleware, function(err, req, res, next) {
  if (err instanceof ev.ValidationError) return res.status(err.status).json(err.errors[0].messages[0]);
});

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 10010;
  app.listen(port);

});
