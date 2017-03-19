'use strict';

function getAllFoods(req, res) {
	let knex = require('../../knex.js');
	knex('foods')
    .orderBy('food_name')
    .then((foods) => {
      res.status(200).json(foods);
  })
  .catch((err) => {
    console.error(err);
  })
	.finally(() => {
		// knex.destroy();
	})
}

function getFood(req, res) {
    let knex = require('../../knex.js');
    let paramId = req.swagger.params.food_id.value;
    console.log(paramId);
    knex('foods')
        .where('id', paramId)
        .then((food) => {
            res.status(200).json(food);
        })
        .catch((err) => {
            console.error(err);
        })
        .finally(() => {
            knex.destroy();
        })
}

module.exports = {
  getAllFoods: getAllFoods,
  getFood: getFood
}
