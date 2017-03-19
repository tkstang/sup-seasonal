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

module.exports = {
  getAllFoods: getAllFoods
}
