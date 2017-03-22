'use strict';

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

function getRecipes(req, res) {
  let knex = require('../../knex.js');
  let recipeIds = [];
  let fullRecipes = [];
  let goodRecipes = [];
  let seasonalIngredients = '';
  let month = req.swagger.params.month.value;
  let urlArray = [];


  knex('foods')
    .where(month, true)
    .then((ingredients) => {
      ingredients.forEach((element) => {
        if (ingredients.indexOf(element) === 0) {
          seasonalIngredients += element.food_name;
        }
        else {
          seasonalIngredients += ', ' + element.food_name;
        }
      })
    })

    .then(() =>{
      let url = `https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByIngredients?ingredients='${seasonalIngredients}'`;

      return fetch(url, {
        method: 'get',
        headers: {
          'x-Mashape-Key': 'yyYYCMfoelmshn9iLWJzawTgalGTp1sEI5ejsnYwhNrq3f48S8'
        }
    })
    .then((results) => {
      return results.json();
    })
    .then((results) => {
      for(var i = 0; i < results.length; i++) {
        recipeIds.push(results[i].id);
      }
      for (var i = 0; i < recipeIds.length; i++) {
        let url = `https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/${recipeIds[i]}/information`
        urlArray.push(url);
        // console.log(urlArray);
      }

      let recipePromises = urlArray.map(url => getRecipeJson(url));
      // console.log(recipePromises);

      return Promise.all(recipePromises)
    })

    .then((results) => {
      results.forEach((element) => {
        fullRecipes.push(element);
      })
    })


    .then(() => {
      fullRecipes.forEach((element) => {
        if(element.instructions !== null) {
          let shortenedRecipe = {
            servings: element.servings,
            sourceURL: element.sourceURL,
            title: element.title,
            readyInMinutes: element.readyInMinutes,
            image: element.image,
            imageType: element.imageType,
            extendedIngredients: element.extendedIngredients,
            instructions: element.instructions
          }
          goodRecipes.push(shortenedRecipe);
        }
      })
    })

    .then(() => {
      console.log(goodRecipes);
      // console.log(seasonalIngredients);
    })

    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      // knex.destroy();
    });
  })
}

module.exports = {
  getRecipes:getRecipes
}
