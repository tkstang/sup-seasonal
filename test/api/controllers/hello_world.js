var should = require('should');
var request = require('supertest');
var server = require('../../../app');
var stt = require('swagger-test-templates');
var swagger = require('../../../api/swagger/swagger.yaml');
var config = {
  assertionFormat: 'should',
  testModule: 'supertest',
  pathName: [],
  // loadTest: [{pathName:'/user', operation:'get', load:{requests: 1000, concurrent: 100}}, { /* ... */ }],
  maxLen: 80,
  // pathParams: {
  //   "id": "0123"
  // }
};

// Generates an array of objects containing the test file content, following specified configuration
// the array contains objects with the scheme { name: <test-file-name>, test: <test-file-content> }
// tests = [ {name: base-path-test.js, test: ... }, {name: users-test.js, test: ... }]
var tests = stt.testGen(swagger, config);

// describe('controllers', function() {
//
//   describe('hello_world', function() {
//
//     describe('GET /hello', function() {
//
//       it('should return a default string', function(done) {
//
//         request(server)
//           .get('/hello')
//           .set('Accept', 'application/json')
//           .expect('Content-Type', /json/)
//           .expect(200)
//           .end(function(err, res) {
//             should.not.exist(err);
//
//             res.body.should.eql('Hello, stranger!');
//
//             done();
//           });
//       });
//
//       it('should accept a name parameter', function(done) {
//
//         request(server)
//           .get('/hello')
//           .query({ name: 'Scott'})
//           .set('Accept', 'application/json')
//           .expect('Content-Type', /json/)
//           .expect(200)
//           .end(function(err, res) {
//             should.not.exist(err);
//
//             res.body.should.eql('Hello, Scott!');
//
//             done();
//           });
//       });
//
//     });
//
//   });
//
// });
