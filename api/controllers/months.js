'use strict';

const fetch = require('node-fetch');
fetch.Promise = require('bluebird');

//Helper function to get recipe information using fetch
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

function getMonth(req, res) {
	let knex = require('../../knex.js');
	let month = req.swagger.params.month.value;
	knex('foods')
	.where(month, true)
	.then((ingredients) => {
		res.status(200).json(ingredients);
	})
	.catch((err) => {
		console.error(err);
	})
	.finally(() => {
		// knex.destroy();
	})
}

function getRecipes(req, res) {
  let knex = require('../../knex.js');
  let seasonalIngredients = '';
  let month = req.swagger.params.month.value;
  let recipeIds = [];
  let urlArray = [];
  let fullRecipes = [];
  let customRecipes = [];



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
      }

      let recipePromises = urlArray.map(url => getRecipeJson(url));

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
            id: element.id,
            servings: element.servings,
            sourceURL: element.sourceURL,
            title: element.title,
            readyInMinutes: element.readyInMinutes,
            image: element.image,
            imageType: element.imageType,
            extendedIngredients: element.extendedIngredients,
            instructions: element.instructions
          }
          customRecipes.push(shortenedRecipe);
        }
      })
    })

    .then(() => {
      console.log(customRecipes);
      res.send(customRecipes);
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
  getMonth: getMonth,
  getRecipes:getRecipes
}
