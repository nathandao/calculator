let MathExp = require('../math-exp');
let expect = require('chai').expect;

describe('MathExp', () => {
  it('should show error when expression is missing', () => {
    let exp = new MathExp(' ');

    expect(exp.getErrorMessage()).to.equal('missing expression');
    expect(exp.evaluate()).to.equal(undefined);
  });

  let invalidExps = [
    { arg: '*', expectedError: 'unexpected "*" at position 1 of expression "*"' },
    { arg: '2 * 2 4 (20 + 14)', expectedError: 'unexpected "4" at position 7 of expression "2 * 2 4 (20 + 14)"' },
    { arg: '10 - 11 + 12 -', expectedError: 'unexpected "-" at position 14 of expression "10 - 11 + 12 -"' },
    { arg: '2*2 (20- 11)', expectedError: 'unexpected "(" at position 5 of expression "2*2 (20- 11)"' },
    { arg: '12 * 3 - )', expectedError: 'unexpected ")" at position 10 of expression "12 * 3 - )"' },
    { arg: '1.3.4 * 12', expectedError: 'unexpected "." at position 4 of expression "1.3.4 * 12"' },
  ];

  invalidExps.forEach(invalidExp => {
    it('should detect invalid expression ' + invalidExp.arg, () => {
      let exp = new MathExp(invalidExp.arg);

      expect(exp.getErrorMessage()).to.equal(invalidExp.expectedError);
      expect(exp.evaluate()).to.equal(undefined);
    });
  });

  it('should detect and evaluate valid expression', () => {
    let validExp = ' - 12*   1.4 / ((-  15- 17  ) * 1.66/ (  11 + 5  ))';
    let expectedResult = eval(validExp);
    let exp = new MathExp(validExp);

    expect(exp.getErrorMessage()).to.equal(null);
    expect(exp.evaluate()).to.equal(expectedResult);
  });
});
