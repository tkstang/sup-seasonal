'use strict';

function userRegistration(req, res){
  const knex = require('../../knex.js');
  bcrypt.hash(req.body.password), 1)
    .then(result => {
      const user = {
        username: req.body.username,
        email: req.body.email,
        hashed_password: result
      }
      return knex('users').insert(user, '*');
    })
    .then(result => {
      const newUser = result[0];
      delete newUser.hashed_password;
      delete newUser.created_at;
      delete newUser.updated_at;
      res.status(200).json(newUser);
    })
    .catch((err) => {
      console.error(err);
    })
  	.finally(() => {
  		// knex.destroy();
  	});
}

module.exports = {
  userRegistration: userRegistration
}
