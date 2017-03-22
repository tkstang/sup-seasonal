'use strict';

process.env.NODE_ENV = 'test';

const request = require('supertest');
const expect = require('chai').expect;
const app = require('../../../app');
let knex = require('../../../knex');

const bodyParser = require('body-parser');
app.use(bodyParser.json());

beforeEach(done => {
  knex.migrate.latest()
  .then(() => {
    Promise.all([
      knex('users').insert({
  			// id:	1,
  			username: 'juicedonjuice',
  			email:	'juiced@gmail.com',
  			permissions: 'user',
  			hashed_password: 'blah',
  			created_at:	'2017-03-19 18:22:58.526251-07',
  			updated_at:	'2017-03-19 18:22:58.526251-07'
  		})
    ])
  })
  .then(() => {
    Promise.all([
      knex('foods').insert([{
  			food_name: 'turnips',
  			created_by: 1,
        created_at: "2017-03-19T22:30:11.400Z",
        updated_at: "2017-03-19T22:30:11.400Z",
        // id: 1,
        jan: true,
  			apr: true,
  			may: true,
  			jun: true,
  			sep: true,
  			oct: true,
  			nov: true,
  			dec: true
  	   },
       {
      food_name: 'carrots',
      created_by: 1,
      created_at: "2017-03-19T22:30:11.400Z",
      updated_at: "2017-03-19T22:30:11.400Z",
      // id: 2,
      mar: true,
      apr: true,
      may: true,
      jun: true,
      sep: true,
      oct: true,
      nov: true,
      dec: true
      },
      {
      food_name: 'barley',
      created_by: 1,
      created_at: "2017-03-19T22:30:11.400Z",
      updated_at: "2017-03-19T22:30:11.400Z",
      // id: 3,
      mar: true,
      apr: true,
      may: true,
      jun: true,
      sep: true,
      oct: true,
      nov: true,
      dec: true
      }
      ])
    ])
})

.then(() => knex.raw(`SELECT setval('foods_id_seq', (SELECT MAX(id) FROM foods))`))
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

describe('GET /months/{month}', () => {
  it('responds with JSON', done => {
    request(app)
      .get('/months/mar')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
  it('returns all foods in season in param month', done => {
    request(app)
      .get('/months/mar')
      .expect(200, [
        {
       food_name: 'carrots',
       created_by: 1,
       created_at: "2017-03-19T22:30:11.400Z",
       updated_at: "2017-03-19T22:30:11.400Z",
       id: 2,
       jan: false,
       feb: false,
       mar: true,
       apr: true,
       may: true,
       jun: true,
       jul: false,
       aug: false,
       sep: true,
       oct: true,
       nov: true,
       dec: true
       },
       {
       food_name: 'barley',
       created_by: 1,
       created_at: "2017-03-19T22:30:11.400Z",
       updated_at: "2017-03-19T22:30:11.400Z",
       id: 3,
       jan: false,
       feb: false,
       mar: true,
       apr: true,
       may: true,
       jun: true,
       jul: false,
       aug: false,
       sep: true,
       oct: true,
       nov: true,
       dec: true
       }
     ], done);
  });
});
