'use strict';

function getAllUsers(req, res) {
	let knex = require('../../knex.js');
	knex('users')
    .orderBy('id')
    .then((users) => {
      res.status(200).json(users);
  })
  .catch((err) => {
    console.error(err);
  })
	.finally(() => {
		knex.destroy();
	})
}

// function getFood(req, res) {
//     let knex = require('../../knex.js');
//     let paramId = req.swagger.params.food_id.value;
//     console.log(paramId);
//     knex('foods')
//         .where('id', paramId)
//         .then((food) => {
//             res.status(200).json(food);
//         })
//         .catch((err) => {
//             console.error(err);
//         })
//         .finally(() => {
//             knex.destroy();
//         })
// }

module.exports = {
  getAllUsers: getAllUsers,
}
