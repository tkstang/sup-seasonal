'use strict';

process.env.NODE_ENV = 'test';

const request = require('supertest');
const expect = require('chai').expect;
const app = require('../../../app');
let knex = require('../../../knex');
let token;

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
  			permissions: 'superuser',
  			hashed_password: '$2a$04$WKGRDLpVKDt7EMk0kB1kC.NItFuLP2Dkpd8lcM9AtRhBaKnPsUE2u',
  			created_at:	'2017-03-19 18:22:58.526251-07',
  			updated_at:	'2017-03-19 18:22:58.526251-07'
  		})
    ])

  })
  .then(() => {
    Promise.all([
      knex('foods').insert([{
  			food_name: 'tulips',
  			created_by: 1,
        created_at: "2017-03-19T22:30:11.400Z",
        updated_at: "2017-03-19T22:30:11.400Z",
        // id: 1,
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
      food_name: 'roses',
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
      food_name: 'daisies',
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


describe('GET api/foods', () => {
  it('responds with JSON', done => {
    request(app)
      .get('/api/foods')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
  it('returns a list of all foods in db', done => {
    request(app)
      .get('/api/foods')
      .expect(200,[
        {
          food_name: 'daisies',
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
        },
        {
          food_name: 'roses',
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
         food_name: 'tulips',
   			 created_by: 1,
         created_at: "2017-03-19T22:30:11.400Z",
         updated_at: "2017-03-19T22:30:11.400Z",
         id: 1,
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

describe('GET /api/foods:id', () => {
  it('responds with JSON', done => {
    request(app)
      .get('/api/foods/2')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
  it('returns food corresponding to ID param', () => {
    request(app)
      .get('/api/foods/2')
      .expect(200, {
        food_name: 'roses',
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
     })
  });
});


describe('POST /foods', () => {
  const newFood = {
    food_name: 'sunflowers',
    mar: true,
    apr: true,
    may: true,
    jun: true,
    sep: true,
    oct: true,
    nov: true,
    dec: true
  };
  const badFood = {
    mar: true,
    jan: true,
    feb: true
  };
  const badFoodName = {
    food_name: true,
    mar: true,
    feb: true
  }

  it('creates a token', done => {
    let loginCred = {
      email: 'juiced@gmail.com',
      password: 'blahblahblah'
    }
    request(app)
    .post('/api/login')
    .send(loginCred)
    .end((err, res) => {
      expect(res.body.token)
      token = res.body.token;
    })
    done();
  })

  it('responds with JSON', done => {
    request(app)
      .post('/api/foods')
      .set('token', token)
      .send(newFood)
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
  it('stores the passed obj into the db', done => {
    request(app)
      .post('/api/foods')
      .set('token', token)
      .send(newFood)
      .end((err, res) => {
//deleting timestamps
        delete res.body.created_at;
        delete res.body.updated_at;
        expect(res.body).to.deep.equal(
          {
            food_name: 'sunflowers',
            created_by: 1,
            id: 4,
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
        )
        done();
      });
  });
  it('returns 400 error when req is missing food_name', done => {
    request(app)
      .post('/api/foods')
      .set('token', token)
      .send(badFood)
      .expect('Content-Type', /json/)
      .expect(400, done);
  });
  it('returns 400 error when food_name is not a string', done => {
    request(app)
      .post('/api/foods')
      .set('token', token)
      .send(badFoodName)
      .expect('Content-Type', /json/)
      .expect(400, done);
  });
});
