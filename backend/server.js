const app = require('./app');
const http = require('http');

const port = process.env.PORT || 3000;
app.set('port', port);

// Create HTTP server.
const server = http.createServer(app);
server.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'))
})
