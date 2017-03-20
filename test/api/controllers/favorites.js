'use strict';

process.env.NODE_ENV = 'test';

const request = require('supertest');
const expect = require('chai').expect;
const app = require('../../../app');
let knex = require('../../../knex');

beforeEach(done => {
  knex.migrate.latest()
  .then(() =>{
    Promise.all([
      knex('favorites').insert([
        {
          user_id: 1,
          recipe_id: 12345,
          month: 'jan',
          created_at: "2017-03-19T22:30:11.400Z",
          updated_at: "2017-03-19T22:30:11.400Z",
          id: 1
        },
        {
          user_id: 2,
          recipe_id: 54321,
          month: 'feb',
          created_at: "2017-03-19T22:30:11.400Z",
          updated_at: "2017-03-19T22:30:11.400Z",
          id: 2
        },
        {
          user_id: 1,
          recipe_id: 66666,
          month: 'apr',
          created_at: "2017-03-19T22:30:11.400Z",
          updated_at: "2017-03-19T22:30:11.400Z",
          id: 3
        }
      ])
    ])
  })

  .then(() => knex.raw(`SELECT setval('users_id_seq', (SELECT MAX(id) FROM users))`))
  .then(() => done())
  .catch((err) => {
    done(err);
  });
});

afterEach(done => {
  knex.migrate.rollback()
  .then(() => done())
  .catch((err) => {
    done(err);
  });
});

after(() => {
  knex.destroy()
})

describe('GET /favorites', () => {
  it('responds with JSON', done => {
    request(app)
      .get('/foods')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});
