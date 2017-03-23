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
  console.log('test');
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
  let url;
  let goodRecipe;
  knex('favorites')
    .where('id', paramId)
    .then((favorite) =>{
      let recipeId = favorite[0].recipe_id;
      url = `https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/479101/information`
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
      console.log(goodRecipe);
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
      if(favorites[0].user_id !== payload.userId) {
        console.log('yoyoyoyoyoy');
        res.status(401).json('This Favorite Belongs To Another User');
      }
      else {

          return knex('favorites')
          .del()
          .where('id', paramId)

        .then(() => {
          res.send(faveToDelete)
        })
        .catch((err) => {
          console.error(err);
        })
      }
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
