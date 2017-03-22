'use strict';

const bcrypt = require('bcrypt-as-promised');

function userLogin(req, res){
  const knex = require('../../knex.js');
	const user;
	knex('users')
	.where('email', req.body.email)
	.then(result => {
		if (result.length === 0){
			return res.status(400).json(`${req.body.email} is not a registered E-mail`);
		} else {
			user = result[0];
			return bcrypt.compare(req.body.password, user.hashed_password);
		}
	})
	.catch(err => {
		res.status(400).json(`The password you entered for ${req.body.emai} is incorrect`);
	})
	.then(() => {
		const claim = { userId: user.id };
		const userToken = jwt.sign(claim, process.env.JWT_KEY, {
			expiresIn: '7 days',
		});
		const loggedInUser = {
			id: user.id,
			username:	user.username,
			email:	user.email,
			permissions:	user.permissions,
			token:	userToken
		}
		res.status(200).json(loggedInUser);
	})
  // bcrypt.hash(req.body.password, 1)
  // .then(result => {
  //   const user = {
  //     username: req.body.username,
  //     email: req.body.email,
  //     hashed_password: result
  //   }
  //   return knex('users').insert(user, '*');
  // })
  // .then(result => {
  //   const newUser = result[0];
  //   delete newUser.hashed_password;
  //   delete newUser.created_at;
  //   delete newUser.updated_at;
  //   res.status(200).json(newUser);
  // })
  // .catch((err) => {
  //   console.error(err);
  // })
	// .finally(() => {
	// 	// knex.destroy();
	// });
})
// let knex = require('../../knex.js');
// knex('users')
//   .where('email', req.body.email)
//   .then(result => {
//     let user = result[0];
//   })
// }

module.exports = {
  userLogin: userLogin
}
