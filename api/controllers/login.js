'use strict';

const bcrypt = require('bcrypt-as-promised');
const jwt = require('jsonwebtoken');

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
  userLogin: userLogin
}
