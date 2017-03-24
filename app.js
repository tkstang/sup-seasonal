'use strict';

var SwaggerExpress = require('swagger-express-mw');
const express = require('express');
const path = require('path');
var app = require('express')();
const bodyParser = require('body-parser');
const ev = require('express-validation');
const Joi = require('joi');
const bcrypt = require('bcrypt-as-promised');
const jwt = require('jsonwebtoken');
const validations = require('./validations/validations.js');
const auth = require('./validations/token.js');
const dotenv = require('dotenv')
const cors = require('cors');
dotenv.load();

app.use(cors());
app.use(express.static(path.join('public/api-docs/dist')));


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

app.use('/favorites', auth.verify);

app.post('/users/login', ev(validations.usersLogin));

app.post('/users/register', ev(validations.usersRegister));


app.put('/users/register', ev(validations.usersRegister));

app.post('/foods', ev(validations.foodsPost));


app.put('/foods', ev(validations.foodsPost));


app.post('/favorites', ev(validations.favoritesPost));


app.put('/favorites', ev(validations.favoritesPost));

app.use('/', validations.checkValError);

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 10010;
  app.listen(port);

});
