'use strict';

const bcrypt = require('bcrypt-as-promised');
const jwt = require('jsonwebtoken');

function getAllUsers(req, res, next) {
  let knex = require('../../knex.js');
  const token = req.headers['token'];
  jwt.verify(token, process.env.JWT_KEY, (err, payload) => {
    if (payload.permissions !== "superuser"){
      res.status(401).json('Unauthorized');
    } else {
      knex('users')
      .orderBy('id')
      .then((users) => {
        res.status(200).json(users);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        // knex.destroy();
      });
    };
  });
}

function getUser(req, res) {
  let knex = require('../../knex.js');
  let paramId = req.swagger.params.user_id.value;
  const token = req.headers['token'];
  jwt.verify(token, process.env.JWT_KEY, (err, payload) => {
    if (payload.permissions !== "superuser"){
      res.status(401).json('Unauthorized');
    } else {
      knex('users')
      .where('id', paramId)
      .then((user) => {
        res.status(200).json(user);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        // knex.destroy();
      });
    };
  });
}

// ----- Is there really any reason for this route? If not remove here and from YAML ----- //
// function addUser(req, res) {
//   let knex = require('../../knex.js');
//   knex('users')
//   .insert({
//     username: req.body.username,
//     email: req.body.email,
//     permissions: req.body.permissions,
//     hashed_password: req.body.hashed_password
//   }, '*')
//   .then((user) => {
//     res.send(user[0]);
//   })
//   .catch((err) => {
//     console.error(err);
//   })
//   .finally(() => {
//     // knex.destroy();
//   });
// }

function updateUser(req, res) {
  let knex = require('../../knex.js');
  let paramId = req.swagger.params.user_id.value;
  const token = req.headers['token'];
  jwt.verify(token, process.env.JWT_KEY, (err, payload) => {
    if (payload.userId !== paramId){
      res.status(401).json('Unauthorized: The ID you are attempting to update belongs to another user');
    } else {
      knex('users')
      .del()
      .where('id', paramId)
      .then(() => {
        knex('users')
        .insert({
          id: paramId,
          username: req.body.username,
          email: req.body.email,
          permissions: req.body.permissions,
          hashed_password: req.body.hashed_password
        }, '*')
        .then((user) => {
          res.send(user[0]);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          // knex.destroy();
        });
      });
    };
  });
}

function deleteUser(req, res) {
  let knex = require('../../knex.js');
  let paramId = req.swagger.params.user_id.value;
  const token = req.headers['token'];
  jwt.verify(token, process.env.JWT_KEY, (err, payload) => {
    if (payload.userId !== paramId){
      res.status(401).json('Unauthorized: The ID you are attempting to delete belongs to another user');
    } else {
      knex('users')
      .del()
      .where('id', paramId)
      .then((user) => {
        res.send(user[0]);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        // knex.destroy();
      });
    };
  });
}

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

function userLogin(req, res){
	const knex = require('../../knex.js');
	knex('users')
	.where('email', req.body.email)
	.then(result => {
		if (result.length === 0){
			return res.status(400).json(`${req.body.email} is not a registered E-mail`);
		} else {
			const user = result[0];
			return bcrypt.compare(req.body.password, user.hashed_password);
		}
	})
	.catch(err => {
		res.status(400).json(`The password you entered for ${req.body.email} is incorrect`);
	})
	.then(() => {
		knex('users')
		.where('email', req.body.email)
		.then(result => {
			const user = result[0];
			const claim = {
				userId: user.id,
				permissions: user.permissions
			};
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
		.catch((err) => {
			console.error(err);
		})
		.finally(() => {
			// knex.destroy();
		})
	});
}

module.exports = {
  getAllUsers: getAllUsers,
  getUser:  getUser,
  addUser:  addUser,
  updateUser: updateUser,
  deleteUser: deleteUser,
  userRegistration: userRegistration,
  userLogin: userLogin
}
