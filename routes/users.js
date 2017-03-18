'use strict';

const express = require('express');
const app = express();
const knex = require('../knex.js');
const router = express.Router();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


router.get('/users', (req, res) => {
  knex('users')
    .orderBy('id')
    .then((users) => {
      res.status(200).json(users);
    })
  .catch((err) => {
    console.error(err);
    knex.destroy();
    process.exit(1);
  });
});
