'use strict';

const jwt = require('jsonwebtoken');

function getFavorites(req, res) {
  let knex = require('../../knex.js');
  const token = req.headers['token'];
  jwt.verify(token, process.env.JWT_KEY, (err, payload) => {
    knex('favorites')
    .where('user_id', payload.userId)
    .orderBy('id')
    .then((faves) => {
      res.status(200).json(faves);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      // knex.destroy();
    })
  });
}

function addFavorite(req, res) {
  let knex = require('../../knex.js');
  const token = req.headers['token'];
  jwt.verify(token, process.env.JWT_KEY, (err, payload) => {
    knex('favorites')
    .insert({
      user_id: payload.userId,
      recipe_id: req.body.recipe_id,
      month: req.body.month
    }, '*')
    .then((favorites) => {
      res.send(favorites[0]);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      // knex.destroy();
    })
  });
}

function getFavorite(req, res) {
  let knex = require('../../knex.js');
  let paramId = req.swagger.params.fave_id.value;
  const token = req.headers['token'];
  jwt.verify(token, process.env.JWT_KEY, (err, payload) => {
    knex('favorites')
    .where('id', paramId)
    .then((favorite) =>{
      res.status(200).json(favorite);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      // knex.destroy();
    })
  });
}

function deleteFavorite(req, res) {
  let knex = require('../../knex.js');
  let paramId = req.swagger.params.fave_id.value;
  let faveToDelete;
  const token = req.headers['token'];
  jwt.verify(token, process.env.JWT_KEY, (err, payload) => {
    knex('favorites')
    .where('id', paramId)
    .then((favorites) => {
      faveToDelete = favorites;
    })
    .then(() => {
      return knex('favorites')
      .del()
      .where('id', paramId)
    })
    .then(() => {
      res.send(faveToDelete)
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      // knex.destroy();
    })
  })
}

module.exports = {
  getFavorites: getFavorites,
  addFavorite: addFavorite,
  getFavorite: getFavorite,
  deleteFavorite: deleteFavorite
}
