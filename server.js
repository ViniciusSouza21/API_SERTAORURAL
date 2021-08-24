const http = require('http');
const app = require('./app');

const port = process.env.PORT || 3001;

const server = http.createServer(app);

console.log(`API listening on the port: ${port}`);
server.listen(port);