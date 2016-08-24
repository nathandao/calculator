let server = require('./server');

let port = process.env.NODE_ENV === 'production' ? 80 : 3000;

server.listen(port, function() {
  console.log('listening to http://localhost:' + port)
});
