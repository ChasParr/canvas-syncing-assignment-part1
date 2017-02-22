const http = require('http');
const fs = require('fs');
const socketio = require('socket.io');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const index = fs.readFileSync(`${__dirname}/../client/index.html`);

const onRequest = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

const app = http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);

const io = socketio(app);

let num = 0;

const onJoin = (sock) => {
  const socket = sock;

  socket.on('join', () => {
    socket.join('room1');
    io.sockets.in('room1').emit('updateNum', { newNum: num });
    console.log('someone joined');
  });

  socket.on('addNum', () => {
    num++;
    io.sockets.in('room1').emit('updateNum', { newNum: num });
    console.log('+1');
  });
};

io.sockets.on('connection', (socket) => {
  onJoin(socket);
});

console.log('Websocket server started');
