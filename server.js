var restify = require('restify');
var MathExp = require('./math-exp');

let server = restify.createServer();
let port = process.env.NODE_ENV === 'production' ? 80 : 8080;

server.use(restify.queryParser());

server.get('/', (req, res, next) => {
  res.send('calculus!');
  next();
})

server.get('/calculus', (req, res, next) => {
  let q = req.query.query || '',
      bf = new Buffer(q, 'base64'),
      expString = bf.toString('utf8'),
      exp = new MathExp(expString);

  let errMessage = exp.getErrorMessage();

  if (errMessage) {
    res.send({
      error: true,
      message: errMessage,
    })
  } else {
    res.send({
      error: false,
      result: exp.evaluate(),
    });
  }
  next();
})

// Export for tests.
module.exports = server;
