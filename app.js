'use strict';

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
const bodyParser = require('body-parser');
const ev = require('express-validation');
const Joi = require('joi');
const bcrypt = require('bcrypt-as-promised');
const jwt = require('jsonwebtoken');
const errIsolate = require('./validations/errIsolation.js');
const validations = require('./validations/validations.js');
const auth = require('./validations/token.js');
const dotenv = require('dotenv')
dotenv.load();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

module.exports = app; // for testing

var config = {
  appRoot: __dirname // required config
};

function checkValidationError(err, req, res, next){
  if (err instanceof ev.ValidationError) {
    return res.status(err.status).json(errIsolate.message(err));
  }
  next();
}

app.use('/favorites', function(err, req, res, next){
  auth.verify(err, req, res, next);
})

// app.post('/users', ev(validations.usersPost), function(err, req, res, next) {
//   checkValidationError(err, req, res, next);
// });

//add usersLogin to validation
app.post('/users/login', ev(validations.usersLogin), function(err, req, res, next) {
  checkValidationError(err, req, res, next);
});



app.put('/users', ev(validations.usersRegister), function(err, req, res, next) {
  checkValidationError(err, req, res, next);
});

app.post('/foods', ev(validations.foodsPost), function(err, req, res, next) {
  checkValidationError(err, req, res, next);
});

app.put('/foods', ev(validations.foodsPost), function(err, req, res, next) {
  checkValidationError(err, req, res, next);
});

// app.post('/favorites', ev(validations.favoritesPost), function(err, req, res, next) {
//   checkValidationError(err, req, res, next);
// });

app.put('/favorites', ev(validations.favoritesPost), function(err, req, res, next) {
  checkValidationError(err, req, res, next);
});



SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 10010;
  app.listen(port);

});
