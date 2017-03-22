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
	});
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
            // knex.destroy();
        })
}

function addFood(req, res) {
	let knex = require('../../knex.js');
	knex('foods')
		.insert({
			food_name: req.body.food_name,
			created_by: 1,
			jan: req.body.jan,
			feb: req.body.feb,
			mar: req.body.mar,
			apr: req.body.apr,
			may: req.body.may,
			jun: req.body.jun,
			jul: req.body.jul,
			aug: req.body.aug,
			sep: req.body.sep,
			oct: req.body.oct,
			nov: req.body.nov,
			dec: req.body.dec
		}, '*')
		.then((foods) => {
			res.send(foods[0]);
		})
		.catch((err) => {
			console.error(err);
		})
		.finally(() => {
			// knex.destroy();
		})
}

function updateFood(req, res) {
	let knex = require('../../knex.js');
	let paramId = req.swagger.params.food_id.value;
	knex('foods')
		.del()
		.where('id', paramId)
		.then(() => {
			knex('foods')
			.insert({
				food_name: req.body.food_name,
				id: paramId,
				created_by: 1,
				jan: req.body.jan,
				feb: req.body.feb,
				mar: req.body.mar,
				apr: req.body.apr,
				may: req.body.may,
				jun: req.body.jun,
				jul: req.body.jul,
				aug: req.body.aug,
				sep: req.body.sep,
				oct: req.body.oct,
				nov: req.body.nov,
				dec: req.body.dec
			}, '*')
			.then((foods) => {
				res.send(foods[0]);
			})
		})
		.catch((err) => {
			console.error(err);
		})
		.finally(() => {
			// knex.destroy();
		})
}

function deleteFood(req, res) {
	let knex = require('../../knex.js');
	let paramId = req.swagger.params.food_id.value;
	let foodToDelete;
	knex('foods')
		.where('id', paramId)
		.then((foods) => {
			foodToDelete = foods;
		})
		.then(() => {
			return knex('foods')
			.del()
			.where('id', paramId)
		})
		.then(() => {
			res.send(foodToDelete)
		})
		.catch((err) => {
			console.error(err);
		})
		.finally(() => {
			// knex.destroy();
		})
}

module.exports = {
  getAllFoods: getAllFoods,
  getFood: getFood,
	addFood: addFood,
	updateFood: updateFood,
	deleteFood: deleteFood
}
