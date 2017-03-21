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
      knex('favorites').insert([
        {
          user_id: 1,
          recipe_id: 12345,
          month: 'jan',
          created_at: "2017-03-19T22:30:11.400Z",
          updated_at: "2017-03-19T22:30:11.400Z"
          // id: 1
        },
        {
          user_id: 1,
          recipe_id: 54321,
          month: 'feb',
          created_at: "2017-03-19T22:30:11.400Z",
          updated_at: "2017-03-19T22:30:11.400Z"
          // id: 2
        },
        {
          user_id: 1,
          recipe_id: 66666,
          month: 'apr',
          created_at: "2017-03-19T22:30:11.400Z",
          updated_at: "2017-03-19T22:30:11.400Z"
          // id: 3
        }
      ])
    ])
  })



  .then(() => knex.raw(`SELECT setval('favorites_id_seq', (SELECT MAX(id) FROM favorites))`))
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
      .get('/favorites')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
  it('returns a list of all faves in db', done => {
    request(app)
      .get('/favorites')
      .expect(200, [
        {
          user_id: 1,
          recipe_id: 12345,
          month: 'jan',
          created_at: "2017-03-19T22:30:11.400Z",
          updated_at: "2017-03-19T22:30:11.400Z",
          id: 1
        },
        {
          user_id: 1,
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
      ], done);
  });
});

describe('GET /favorites:id', () => {
  it('responds with JSON', done => {
    request(app)
    .get('/favorites/2')
    .expect('Content-Type', /json/)
    .expect(200, done);
  });
  it('returns fave corresponding to ID param', () => {
    request(app)
    .get('/favorites/2')
    .expect(200, {
      user_id: 1,
      recipe_id: 54321,
      month: 'feb',
      created_at: "2017-03-19T22:30:11.400Z",
      updated_at: "2017-03-19T22:30:11.400Z",
      id: 2
    })
  });
});

describe('POST /favorites', () => {
  const newFave = {
    created_at: '2017-03-11T22:30:11.400Z',
    updated_at: "2017-03-11T22:30:11.400Z",
    user_id: 1,
    recipe_id: 98765,
    month: 'mar'
    // id: 7
  };

  it('responds with JSON', done => {
    request(app)
      .post('/favorites')
      .send(newFave)
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
  it('stores the passed obj into the db', done => {
    request(app)
    .post('/favorites')
    .send(newFave)
    .end((err, res) => {
      console.log(newFave);
//deleting timestamps
      delete res.body.created_at;
      delete res.body.updated_at;
      expect(res.body).to.deep.equal(
        {
          user_id: 1,
          recipe_id: 98765,
          month: 'mar',
          id: 4
        }
      )
      done();
    });
  });
});
