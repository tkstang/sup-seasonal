'use strict';

const bcrypt = require('bcrypt-as-promised');

function userRegistration(req, res){
  const knex = require('../../knex.js');
  bcrypt.hash(req.body.password, 1)
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
			const claim = {
				userId: newUser.id,
				permissions: newUser.permissions
			 };
			const userToken = jwt.sign(claim, process.env.JWT_KEY, {
				expiresIn: '7 days',
			});
			const loggedInUser = {
				id: newUser.id,
				username:	newUser.username,
				email:	newUser.email,
				permissions:	newUser.permissions,
				token:	userToken
			}
      res.status(200).json(loggedInUser);
    })
    .catch((err) => {
      let errMessage = err.detail.slice(4).replace(/[{()}]/g, '').replace(/[=]/g, ' ');
      res.status(400).json(errMessage);
    })
  	.finally(() => {
  		// knex.destroy();
  	});
}

module.exports = {
  userRegistration: userRegistration
}
