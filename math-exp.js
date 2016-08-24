const regBracketClose = /\)/;
const regBracketOpen = /\(/;
const regBrackets = /[\(\)]/;
const regDigits = /\d/;
const regDot = /\./;
const regOps = /[\+\-*\/]/;
const regPlusMinus = /[\+-]/;
const regSpace = / /;

class MathExp {
  constructor(exp) {
    this.expression = exp.trim();
  }

  /**
   * Validate the expression string and return the first error message should
   * it exist.
   * @returns {string}
   */
  getErrorMessage() {
    let exp = this.expression,
        errMessage = null,
        pendingBrackets = 0,
        iteratingFloat = false,
        allowedChars = regExpOr(regPlusMinus, regDigits, regBracketOpen);

    if (this.expression === '') {
      errMessage = 'missing expression';
    } else {

      for (let i = 0; i < exp.length; i++) {
        let currentChar = exp[i],
            nextChar = exp[i + 1],
            opts = {};

        // Skip white space.
        if (currentChar === ' ') continue;

        // States updates.
        if (currentChar === '(') {
          pendingBrackets++;
        } else if (currentChar === ')') {
          pendingBrackets--;
        } else if (currentChar === '.') {
          iteratingFloat = true;
        } else if(nextChar && nextChar.match(regExpOr(regOps, regBrackets, regSpace))) {
          iteratingFloat = false;
        }

        // Last character can only be digit of closing bracket.
        if (i === exp.length - 1)
          allowedChars = regExpOr(regBracketClose, regDigits);

        // Terminate uppon error.
        if (pendingBrackets < 0 || !currentChar.match(allowedChars)) {
          errMessage = `unexpected "${currentChar}" at position ${i+1} of expression "${exp}"`;
          break;
        }

        // No white space between two consecutive digits.
        if (currentChar.match(regDigits) && nextChar === ' ') opts.noDigit = true;
        opts.iteratingFloat = iteratingFloat;
        allowedChars = getNextAllowedChars(currentChar, opts);
      }

      if (pendingBrackets > 0 && !errMessage) {
        errMessage = 'missing closing bracket(s)';
      }
    }

    return errMessage;
  }

  /**
   * Evaluate the expression string.
   * @returns {number} or undefined
   */
  evaluate() {
    if (this.getErrorMessage() === null) {
      try {
        this.result = eval(this.expression);
        return this.result;
      } catch(err) {
        console.log(err)
      }
    }
  }
}

/**
 * Combine multiple regular expressions using or.
 * @returns {RegExp} 
 */
function regExpOr() {
  let combined = null;
  for (let i in arguments) {
    if (!combined) {
      combined = arguments[i]
    } else {
      combined = new RegExp(combined.source + '|' + arguments[i].source);
    }
  }
  return combined;
}

/**
 * Helper function to get the next allowed characters in the expression iterator
 * based on the current character and additional options.
 * @param {char} currentChar
 * @param {object} {noDigit: {boolean}, iteratingFloat: {boolean}}
 * @returns {RegExp}
 */
function getNextAllowedChars(currentChar, opts) {
  let noDigit = opts.noDigit || false,
      iteratingFloat = opts.iteratingFloat || false;

  if (iteratingFloat) {
    // When iterating a float number, only allow following digits after the "."
    return regDigits;

  } else if (currentChar.match(regDigits) && noDigit) {
    // Disallow space between 2 consecutive numbers.
    return regExpOr(regBracketClose, regOps);

  } else if (currentChar.match(regDigits)) {
    return regExpOr(regOps, regBracketClose, regDigits, regDot);

  } else if (currentChar.match(regBracketOpen)) {
    return regExpOr(regDigits, regBracketOpen, regPlusMinus);

  } else if (currentChar.match(regBracketClose)) {
    return regExpOr(regOps, regBracketClose)

  } else if (currentChar.match(regOps)) {
    return regExpOr(regBracketOpen, regDigits);

  } else {
    return regDigits;
  }
}

module.exports = MathExp;
