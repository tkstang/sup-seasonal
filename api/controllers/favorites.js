'use strict';

function getFavorites(req, res) {
  let knex = require('../../knex.js');
  knex('favorites')
    .orderBy('user_id')
    .then((faves) => {
      res.status(200).json(faves);
    })
  .catch((err) => {
    console.error(err);
  })
  .finally(() => {
    // knex.destroy();
  })
}

module.exports = {
  getFavorites: getFavorites
}
