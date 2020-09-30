var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

http.listen(5000, () => {
    console.log('listening on *:5000');
  });

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log(`a user ${socket.id}`);
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });

  io.on('connection', (socket) => {
    socket.on('chat message', (msg , user) => {
      io.emit('chat user', user);
      io.emit('chat message', msg);
    });
  });

io.on('new user' , (socket) => {
    io.emit(`${socket.id} as connected !`);
});








  require("./routes/userRoutes")(app);  