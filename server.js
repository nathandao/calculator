let restify = require('restify');
let MathExp = require('./math-exp');

let server = restify.createServer();
let port = process.env.NODE_ENV === 'production' ? 80 : 8080;

server.use(restify.queryParser());

server.get('/', (req, res, next) => {
  res.send('calculus!');
  next();
})

server.get('/calculus', (req, res, next) => {
  let q = req.query.query || '',
      expString = new Buffer(q, 'base64').toString('utf8'),
      exp = new MathExp(expString),
      errMessage = exp.getErrorMessage();

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

module.exports = server;
