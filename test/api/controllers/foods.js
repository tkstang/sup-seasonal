'use strict';

process.env.NODE_ENV = 'test';

const request = require('supertest');
const expect = require('chai').expect;
const app = require('../../../app');
let knex = require('../../../knex');

const bodyParser = require('body-parser');

// app.use(bodyParser.json());

beforeEach(done => {
  Promise.all([
    knex('foods').insert({
			food_name: 'tulips',
			created_by: 1,
			mar: true,
			apr: true,
			may: true,
			jun: true,
			sep: true,
			oct: true,
			nov: true,
			dec: true
	}),
    knex('foods').insert({
			food_name: 'roses',
			created_by: 1,
			mar: true,
			apr: true,
			may: true,
			jun: true,
			sep: true,
			oct: true,
			nov: true,
			dec: true
	}),
    knex('foods').insert({
			food_name: 'daisies',
			created_by: 1,
			mar: true,
			apr: true,
			may: true,
			jun: true,
			sep: true,
			oct: true,
			nov: true,
			dec: true
	})
  ])
	.then(() => done())
	.catch((err) => {
		done(err);
	});
});

afterEach(done => {
	knex('foods')
	.del()
	// .then(() => knex.destroy())
	.then(() => done())
	.catch((err) => {
		done(err);
	});
});

after(() => {
	knex.destroy()
})


describe('GET /foods', () => {
  it('responds with JSON', done => {
    request(app)
      .get('/foods')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});
