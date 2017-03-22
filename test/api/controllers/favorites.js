'use strict';

process.env.NODE_ENV = 'test';

const request = require('supertest');
const expect = require('chai').expect;
const app = require('../../../app');
let knex = require('../../../knex');

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const fetch = require('node-fetch');
fetch.Promise = require('bluebird');


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
    it('returns recipe related to fave recipeID', () => {
      request(app)
        .get('favorites/2')
        .expect(200, [ { id: 479101,
    servings: 4,
    sourceURL: undefined,
    title: 'On the Job: Pan Roasted Cauliflower From Food52',
    readyInMinutes: 20,
    image: 'https://spoonacular.com/recipeImages/On-the-Job--Pan-Roasted-Cauliflower-From-Food52-479101.jpg',
    imageType: 'jpg',
    extendedIngredients:
     [ [Object],
       [Object],
       [Object],
       [Object],
       [Object],
       [Object],
       [Object],
       [Object],
       [Object] ]
    }])
  })
});

describe('POST /favorites', () => {
  const newFave = {
    user_id: 1,
    recipe_id: 98765,
    month: 'mar'
  };
  const noMonth = {
    user_id: 1,
    recipe_id: 98765
  };
  const noRecipe = {
    user_id: 1,
    month: 'mar'
  }
  const noUser = {
    recipe_id: 98765,
    month: 'mar'
  }
  const badRecipe = {
    user_id: 1,
    recipe_id: '98765',
    month: 'mar'
  }
  const badMonth = {
    user_id: 1,
    recipe_id: 98765,
    month: 123
  }
  const badUser = {
    user_id: 'joe',
    recipe_id: 98765,
    month: 'mar'
  }

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
  it('returns 400 error when req is missing month', done => {
    request(app)
    .post('/foods')
    .send(noMonth)
    .expect('Content-Type', /json/)
    .expect(400, done);
  });
  it('returns 400 error when req is missing recipe_id', done => {
    request(app)
    .post('/foods')
    .send(noRecipe)
    .expect('Content-Type', /json/)
    .expect(400, done);
  });
  it('returns 400 error when req is missing user_id', done => {
    request(app)
    .post('/foods')
    .send(noUser)
    .expect('Content-Type', /json/)
    .expect(400, done);
  });
  it('returns 400 error when recipe_id is not a number', done => {
    request(app)
    .post('/foods')
    .send(badRecipe)
    .expect('Content-Type', /json/)
    .expect(400, done);
  });
  it('returns 400 error when user_id is not a number', done => {
    request(app)
    .post('/foods')
    .send(badUser)
    .expect('Content-Type', /json/)
    .expect(400, done);
  });
  it('returns 400 error when month is not a string', done => {
    request(app)
    .post('/foods')
    .send(badMonth)
    .expect('Content-Type', /json/)
    .expect(400, done);
  });
});
