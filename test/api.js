let chai = require('chai');
let chaiHttp = require('chai-http');
let expect = chai.expect;

let server = require('../server');

chai.use(chaiHttp);

describe('GET /calculus', () => {
  describe('when expression is invalid', () => {
    it('should return error json', (done) => {
      let exp = {
        arg: '2 * 2 4 (20 + 14)',
        expectedError: 'unexpected "4" at position 7 of expression "2 * 2 4 (20 + 14)"',
      };
      let encodedExp = new Buffer(exp.arg).toString('base64');

      chai.request(server)
        .get('/calculus')
        .query({ query: encodedExp })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.eql({
            error: true,
            message: exp.expectedError,
          });
          done();
        });
    });
  })

  describe('when expression is missing', () => {
    it('should return missing error json', (done) => {
      chai.request(server)
        .get('/calculus')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.eql({
            error: true,
            message: "missing expression",
          });
          done();
        });
    });
  });

  describe('when expression is valid', () => {
    it('should return correct json value', (done) => {
      let exp = ' - 12*   1.4 / ((-  15- 17  ) * 1.66/ (  11 + 5  ))';
      let expectedResult = eval(exp);
      let encodedExp = new Buffer(exp).toString('base64');

      chai.request(server)
        .get('/calculus')
        .query({ query: encodedExp })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.eql({
            error: false,
            result: expectedResult,
          });
          done();
        });
    });
  })
})
