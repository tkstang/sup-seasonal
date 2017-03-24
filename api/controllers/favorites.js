'use strict';

const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
fetch.Promise = require('bluebird');

function getRecipeJson(url) {
  return   fetch(url, {
    method: 'get',
    headers: {
      'x-Mashape-Key': 'yyYYCMfoelmshn9iLWJzawTgalGTp1sEI5ejsnYwhNrq3f48S8'
    }
  })
  .then(function(res) {
    return res.json();
  })
  .then(function(jsonresult) {
    return jsonresult;
  })
  .catch(function(error) {
    console.error(error);
  });
}

// app.use('/', checkValidationError(err, req, res, next));

function getFavorites(req, res, next) {
  let knex = require('../../knex.js');
  console.log(req.body);
  knex('favorites')
  .where('user_id', req.body.userId)
  .orderBy('id')
  .then((faves) => {
    res.status(200).json(faves);
  })
  .catch((err) => {
    console.error(err);
    next(err);
  })
  .finally(() => {
    // knex.destroy();
  });
}

function addFavorite(req, res) {
  let knex = require('../../knex.js');
  knex('favorites')
  .insert({
    user_id: req.body.userId,
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
  });
}

function getFavorite(req, res) {
  let knex = require('../../knex.js');
  let paramId = req.swagger.params.fave_id.value;
  const token = req.headers['token'];
  jwt.verify(token, process.env.JWT_KEY, (err, payload) => {
    knex('favorites')
    let url;
    let goodRecipe;
    knex('favorites')
    .where('id', paramId)
    .then((favorite) =>{
      let recipeId = favorite[0].recipe_id;
      url = `https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/${recipeId}/information`
      return getRecipeJson(url);
    })
    .then((result) => {
      goodRecipe = [{
        id: result.id,
        servings: result.servings,
        sourceURL: result.sourceURL,
        title: result.title,
        readyInMinutes: result.readyInMinutes,
        image: result.image,
        imageType: result.imageType,
        extendedIngredients: result.extendedIngredients,
        instructions: result.instructions
      }]
      res.send(goodRecipe);

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
