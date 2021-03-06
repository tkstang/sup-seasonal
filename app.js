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
const errIsolate = require('./validations/errIsolation.js');
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

app.use('/api/favorites', auth.verify);

app.use('/api/users', auth.verify);

app.post('/api/login', ev(validations.usersLogin));

app.post('/api/register', ev(validations.usersRegister));

app.put('/api/users/:user_id', ev(validations.usersRegister));

app.post('/api/foods', auth.verify, ev(validations.foodsPost));

app.put('/api/foods/:food_id', auth.verify, ev(validations.foodsPost));

app.delete('/api/foods/:food_id', auth.verify);

app.post('/api/favorites', ev(validations.favoritesPost));

app.put('/api/favorites/:fave_id', ev(validations.favoritesPost));

app.use('/api/', validations.checkValError);

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 10010;
  app.listen(port);

});
