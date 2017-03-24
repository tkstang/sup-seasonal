'use strict';

const bcrypt = require('bcrypt-as-promised');
const jwt = require('jsonwebtoken');

function getAllUsers(req, res, next) {
  let knex = require('../../knex.js');
  if (req.body.permissions !== "superuser"){
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
}

function getUser(req, res) {
  let knex = require('../../knex.js');
  let paramId = req.swagger.params.user_id.value;
  if (req.body.permissions !== "superuser"){
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
}

function updateUser(req, res) {
  let knex = require('../../knex.js');
  let paramId = req.swagger.params.user_id.value;
  if (req.body.userId !== paramId){
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
}

function deleteUser(req, res) {
  let knex = require('../../knex.js');
  let paramId = req.swagger.params.user_id.value;
  if (req.body.userId !== paramId){
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
}

module.exports = {
  getAllUsers: getAllUsers,
  getUser:  getUser,
  updateUser: updateUser,
  deleteUser: deleteUser
}
