'use strict';

const express = require('express');
const app = express();
const knex = require('../knex.js');
const router = express.Router();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

router.get('/foods', (req, res) => {
  knex('foods')
    .orderBy('food_name')
    .then((foods) => {
      res.status(200).json(foods);
  })
  .catch((err) => {
    console.error(err);
    // knex.destroy();
    process.exit(1);
  });
});

router.post('/foods', (req, res) => {
  knex('foods')
    .insert({
      food_name: req.body.food_name,
      created_by: req.body.created_by,
      jan: req.body.jan,
      feb: req.body.feb,
      mar: req.body.mar,
      apr: req.body.apr,
      may: req.body.apr,
      jun: req.body.jun,
      jul: req.body.jul,
      aug: req.body.aug,
      sep: req.body.sep,
      oct: req.body.oct,
      nov: req.body.nov,
      dec: req.body.dec
    }, '*')
  .then((food) => {
    res.send(food[0]);
  })
  .catch((err) => {
    console.error(err);
    knex.destroy();
    process.exit(1);
  });
});

router.delete('/foods/:name')

module.exports = router;
