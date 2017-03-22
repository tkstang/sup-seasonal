'use strict';
const fetch = require('node-fetch');
fetch.Promise = require('bluebird');

function getRecipes(req, res) {
  var url = `https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByIngredients?ingredients='broccoli'`;
  let recipeIds = [];
  let fullRecipes = [];
  let goodRecipes = [];

  fetch(url, {
    method: 'get',
    headers: {
      'x-Mashape-Key': 'yyYYCMfoelmshn9iLWJzawTgalGTp1sEI5ejsnYwhNrq3f48S8'
    }
  })
  .then((results) => {
    return results.json();
  })
  .then((results) => {
    for (var i = 0; i < results.length; i++) {
      recipeIds.push(results[i].id);
    }
    for (var i = 0; i < recipeIds.length; i++) {
      fetch(`https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/${recipeIds[i]}/information`, {
        method: 'get',
        headers: {
          'x-Mashape-Key': 'yyYYCMfoelmshn9iLWJzawTgalGTp1sEI5ejsnYwhNrq3f48S8'
        }
      })
      .then((results) => {
        return results.json();
      })
      .then((results) => {
        fullRecipes.push(results);
      })
      console.log(recipeIds);
      console.log(fullRecipes);
    }
    console.log(recipeIds);
    console.log(fullRecipes);
  })
  .catch((err) => {
    console.error(err);
  })
  .finally(() => {
    // knex.destroy();
  });
  setTimeout(() => {
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
  console.log(goodRecipes);
  }, 3000)

}

module.exports = {
  getRecipes:getRecipes
}
