let server = require('./server');
let port = process.env.PORT || 3000;

server.listen(port, function() {
  console.log('listening to http://localhost:' + port)
});
