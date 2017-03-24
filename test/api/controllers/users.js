'use strict';

process.env.NODE_ENV = 'test';

const app = require('../../../app');
const supertest = require('supertest')(app);
const expect = require('chai').expect;
let knex = require('../../../knex');

beforeEach(done => {
	knex.migrate.latest()
	.then(() => {
		Promise.all([
			knex('users').insert({
				id:	1,
				username: 'juicedonjuice',
				email:	'juiced@gmail.com',
				permissions: 'user',
				hashed_password: '$2a$04$sRsM4/1C4Gk3SC456Av9ZO0gby0yrj9uLpA5QIsgcZZFPt.qidBEy',
				created_at:	'2017-03-20T01:22:54.526Z',
				updated_at:	'2017-03-20T01:22:54.526Z'
			}),
			knex('users').insert({
				id:	2,
				username: 'fruity4life',
				email:	'fruity4life@gmail.com',
				permissions: 'user',
				hashed_password: '$2a$04$sRsM4/1C4Gk3SC456Av9ZO0gby0yrj9uLpA5QIsgcZZFPt.qidBEy',
				created_at:	'2017-03-20T01:22:56.526Z',
				updated_at:	'2017-03-20T01:22:56.526Z'
			}),
			knex('users').insert({
				id:	3,
				username: 'tommytomato',
				email:	'tommytomato@gmail.com',
				permissions: 'user',
				hashed_password: '$2a$04$sRsM4/1C4Gk3SC456Av9ZO0gby0yrj9uLpA5QIsgcZZFPt.qidBEy',
				created_at:	'2017-03-20T01:22:58.526Z',
				updated_at:	'2017-03-20T01:22:58.526Z'
			})
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

describe('GET /users', () => {
  it('responds with JSON', done => {
    supertest
      .get('/users')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
  it('returns an array of all user objects when responding with JSON', done => {
    supertest
      .get('/users')
      .expect('Content-Type', /json/)
      .expect(200, [{
				id:	1,
				username: 'juicedonjuice',
				email:	'juiced@gmail.com',
				permissions: 'user',
				hashed_password: '$2a$04$sRsM4/1C4Gk3SC456Av9ZO0gby0yrj9uLpA5QIsgcZZFPt.qidBEy',
				created_at:	'2017-03-20T01:22:54.526Z',
				updated_at:	'2017-03-20T01:22:54.526Z'
			},{
				id:	2,
				username: 'fruity4life',
				email:	'fruity4life@gmail.com',
				permissions: 'user',
				hashed_password: '$2a$04$sRsM4/1C4Gk3SC456Av9ZO0gby0yrj9uLpA5QIsgcZZFPt.qidBEy',
				created_at:	'2017-03-20T01:22:56.526Z',
				updated_at:	'2017-03-20T01:22:56.526Z'
			},{
				id:	3,
				username: 'tommytomato',
				email:	'tommytomato@gmail.com',
				permissions: 'user',
				hashed_password: '$2a$04$sRsM4/1C4Gk3SC456Av9ZO0gby0yrj9uLpA5QIsgcZZFPt.qidBEy',
				created_at:	'2017-03-20T01:22:58.526Z',
				updated_at:	'2017-03-20T01:22:58.526Z'
			}], done);
  });
});

describe('GET /users/2', () => {
  it('responds with JSON', done => {
    supertest
      .get('/users/2')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
  it('returns an array with a single user object when responding with JSON', done => {
    supertest
      .get('/users/2')
      .expect('Content-Type', /json/)
      .expect(200, [{
				id:	2,
				username: 'fruity4life',
				email:	'fruity4life@gmail.com',
				permissions: 'user',
				hashed_password: '$2a$04$sRsM4/1C4Gk3SC456Av9ZO0gby0yrj9uLpA5QIsgcZZFPt.qidBEy',
				created_at:	'2017-03-20T01:22:56.526Z',
				updated_at:	'2017-03-20T01:22:56.526Z'
			}], done);
  });
});
