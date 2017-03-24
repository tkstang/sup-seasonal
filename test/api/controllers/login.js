
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
				username: 'juicedonjuice',
				email:	'juiced@gmail.com',
				permissions: 'user',
				hashed_password: '$2a$04$WKGRDLpVKDt7EMk0kB1kC.NItFuLP2Dkpd8lcM9AtRhBaKnPsUE2u',
				created_at:	'2017-03-20T01:22:54.526Z',
				updated_at:	'2017-03-20T01:22:54.526Z'
			}),
			knex('users').insert({
				username: 'fruity4life',
				email:	'fruity4life@gmail.com',
				permissions: 'user',
				hashed_password: '$2a$04$sRsM4/1C4Gk3SC456Av9ZO0gby0yrj9uLpA5QIsgcZZFPt.qidBEy',
				created_at:	'2017-03-20T01:22:56.526Z',
				updated_at:	'2017-03-20T01:22:56.526Z'
			}),
			knex('users').insert({
				username: 'tommytomato',
				email:	'tommytomato@gmail.com',
				permissions: 'superuser',
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

let token = '';
describe('POST /login', () => {
	let loginCred = {
		email: 'juiced@gmail.com',
		password: 'blahblahblah'
	}
	it('creates a token', done => {
    supertest
    .post('/login')
    .send(loginCred)
    .end((err, res) => {
      expect(res.body.token)
      token = res.body.token;
			console.log(token);
    })
    done();
  })
	it('responds with JSON', done => {
		supertest
		.post('/login')
		.send(loginCred)
		.set('token', token)
		.expect('Content-Type', /json/)
		.expect(200, done);
	})
  it('returns an object with the logged in users information', done => {
    supertest
		.post('/login')
		.send(loginCred)
    .expect('Content-Type', /json/)
    .expect(200, {
			id:	1,
			username: 'juicedonjuice',
			email:	'juiced@gmail.com',
			permissions: 'user',
			token:	token
		}, done);
  });
});
