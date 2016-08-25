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
    let errMessage = null;

    if (this.expression === '') {
      errMessage = 'missing expression';
    } else {
      let exp = this.expression,
          allowedChars = regExpOr(regPlusMinus, regDigits, regBracketOpen),
          pendingBrackets = 0,
          iteratingDecimal = false;

      for (let i = 0; i < exp.length; i++) {
        let currentChar = exp[i],
            nextChar = exp[i + 1],
            disallowDigit = false;

        // Skip white space.
        if (currentChar === ' ') continue;

        // States updates.
        if (currentChar === '(') {
          pendingBrackets++;
        } else if (currentChar === ')') {
          pendingBrackets--;
        } else if (currentChar === '.') {
          iteratingDecimal = true;
        } else if (nextChar && nextChar.match(regExpOr(regOps, regBrackets, regSpace))) {
          iteratingDecimal = false;
        }

        // Last character can only be digit or closing bracket.
        if (i === exp.length - 1) {
          allowedChars = regExpOr(regBracketClose, regDigits);
        }

        // Terminate uppon error.
        if (pendingBrackets < 0 || !currentChar.match(allowedChars)) {
          errMessage = `unexpected "${currentChar}" at position ${i+1} of expression "${exp}"`;
          break;
        }

        // No white space between two consecutive digits.
        if (currentChar.match(regDigits) && nextChar === ' ') {
          disallowDigit = true;
        }

        // Update the next allowed characters regex.
        allowedChars = getNextAllowedChars(currentChar, {
          disallowDigit,
          iteratingDecimal
        });
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
        return eval(this.expression);
      } catch(err) {
        console.log(err);
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
 * @param {object} {disallowDigit: {boolean}, iteratingDecimal: {boolean}}
 * @returns {RegExp}
 */
function getNextAllowedChars(currentChar, opts) {
  let disallowDigit = opts.disallowDigit || false,
      iteratingDecimal = opts.iteratingDecimal || false;

  if (iteratingDecimal) {
    // When iterating a float number, only allow following digits after the "."
    return regDigits;

  } else if (currentChar.match(regDigits) && disallowDigit) {
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
