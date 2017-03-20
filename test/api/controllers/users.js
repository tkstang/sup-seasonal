'use strict';

process.env.NODE_ENV = 'test';

const request = require('supertest');
const expect = require('chai').expect;
const app = require('../../../app');
let knex = require('../../../knex');

beforeEach(done => {
	knex.migrate.latest()
	.then(() => {
		knex('users').insert({
			id:	1,
			username: 'juicedonjuice',
			email:	'juiced@gmail.com',
			permissions: 'user',
			hashed_password: 'blah',
			created_at:	'2017-03-19 18:22:58.526251-07',
			updated_at:	'2017-03-19 18:22:58.526251-07'
		},{
			id:	2,
			username: 'fruity4life',
			email:	'fruity4life@gmail.com',
			permissions: 'user',
			hashed_password: 'blah',
			created_at:	'2017-03-19 18:23:58.526251-07',
			updated_at:	'2017-03-19 18:23:58.526251-07'
		},{
			id:	3,
			username: 'tommytomato',
			email:	'tommytomato@gmail.com',
			permissions: 'user',
			hashed_password: 'blah',
			created_at:	'2017-03-19 18:24:58.526251-07',
			updated_at:	'2017-03-19 18:24:58.526251-07'
		})
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

describe('GET /users', () => {
  it('responds with JSON', done => {
    request(app)
      .get('/users')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
  it('returns an array of all user objects when responding with JSON', done => {
    request(app)
      .get('/users')
      .expect('Content-Type', /json/)
      .expect(200, [{
				id:	1,
				username: 'juicedonjuice',
				email:	'juiced@gmail.com',
				permissions: 'user',
				hashed_password: 'blah',
				created_at:	'2017-03-19 18:22:58.526251-07',
				updated_at:	'2017-03-19 18:22:58.526251-07'
			},{
				id:	2,
				username: 'fruity4life',
				email:	'fruity4life@gmail.com',
				permissions: 'user',
				hashed_password: 'blah',
				created_at:	'2017-03-19 18:23:58.526251-07',
				updated_at:	'2017-03-19 18:23:58.526251-07'
			},{
				id:	3,
				username: 'tommytomato',
				email:	'tommytomato@gmail.com',
				permissions: 'user',
				hashed_password: 'blah',
				created_at:	'2017-03-19 18:24:58.526251-07',
				updated_at:	'2017-03-19 18:24:58.526251-07'
			}], done);
  });
});
