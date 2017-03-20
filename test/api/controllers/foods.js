'use strict';

process.env.NODE_ENV = 'test';

const request = require('supertest');
const expect = require('chai').expect;
const app = require('../../../app');
let knex = require('../../../knex');

const bodyParser = require('body-parser');

// app.use(bodyParser.json());

beforeEach(done => {
  // Promise.all([
  //   knex('foods').insert([{
	// 		food_name: 'tulips',
	// 		created_by: 1,
	// 		mar: true,
	// 		apr: true,
	// 		may: true,
	// 		jun: true,
	// 		sep: true,
	// 		oct: true,
	// 		nov: true,
	// 		dec: true
	//    },
  //    {
  //   food_name: 'roses',
  //   created_by: 1,
  //   mar: true,
  //   apr: true,
  //   may: true,
  //   jun: true,
  //   sep: true,
  //   oct: true,
  //   nov: true,
  //   dec: true
  //   },
  //   {
  //   food_name: 'daisies',
  //   created_by: 1,
  //   mar: true,
  //   apr: true,
  //   may: true,
  //   jun: true,
  //   sep: true,
  //   oct: true,
  //   nov: true,
  //   dec: true
  //   }
  //   ])
  // ])

  console.log('test');
  knex.migrate.latest()


	.then(() => done())
	.catch((err) => {
		done(err);
	});
});

afterEach(done => {
	knex('foods')
	.del()
	// .then(() => knex.destroy())
  .then(() => {
    knex.migrate.rollback();
  })
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
  it('returns a list of all foods in db', done => {
    request(app)
      .get('/foods')
      .expect(200,[
        {
        food_name: 'daisies',
        created_by: 1,
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
        dec: true,
        created_at: "2017-03-19T22:30:11.400Z",
        updated_at: "2017-03-19T22:30:11.400Z",
        id: 186
        },
        {
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
       },
       {
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
   	   }
      ], done);
  });
});

describe('GET /foods:id', () => {
  it('responds with JSON', done => {
    request(app)
      .get('/foods/2')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});
