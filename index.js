let express = require('express');
let app = express();
let path = require('path');
let server = require('http').createServer(app);
let io = require('socket.io')(server);
var port =  5000;


let me = false;
let userinchat = 0;


server.listen(port, () => {
  console.log('Server listening at port %d', port);
});

app.use(express.static(path.join(__dirname, 'public')));
  

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', (socket) => {
    console.log(`a user ${me}`);
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });

io.sockets.on('connection', (socket) => {
    
    // LOGIN 
    socket.on('login' , (user)=>{
      me = user;
      me.id = userinchat++;
      socket.emit('logged');
      console.log(user);
      io.sockets.emit('newuser' , me);

    });
    // ON A RECU UN MSG
    socket.on('newmsg' , (message) =>{
      message.user = me;
      date = new Date();
      message.h = date.getHours();
      message.m = date.getMinutes();
      io.sockets.emit('newmsg', message);
    });

    // UN UTILISATEUR SE DECO
    socket.on('disconnect', (userinchat) =>{
      if(!me){
        return false;
      }
      me.id = userinchat--;
      io.sockets.emit('userdisco' , me);
    })
    
  });










