#!/usr/bin/env node
const mongoose = require('mongoose');
const Msg = require('./models/Message');
let express = require('express');
let app = express();
let path = require('path');
let server = require('http').createServer(app);
let io = require('socket.io')(server);
const port =  5000;
let msg = "" ;

// COTER SERVER

let me = false;
let userinchat = 0;
let users = {};

mongoose
    .connect("mongodb+srv://dualvex:dualvex@cluster0.akd3z.mongodb.net/Chat?retryWrites=true&w=majority", {
        useUnifiedTopology: true ,
        useNewUrlParser: true,
        useCreateIndex: true,
      })
      .then(() => {
          server.listen(port, () => console.log(`Server and Database running on ${port}, http://localhost:${port}` ));
      })
      .catch((err) => {
          console.log(err);
      });

// server.listen(port, () => {
//   console.log('Server listening at port %d', port);
// });

app.use(express.static(path.join(__dirname, 'public')));
  

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
  
});


io.on('connection', (socket) => {
    console.log(`a user as Connected .`);
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });




io.sockets.on('connection', (socket) => {
    
    for(let k in users){
        socket.emit('newuser', users[k]);
    }



    // LOGIN 
    socket.on('login' , async (user)=>{
      me = user;
      me.id = userinchat++;
      socket.emit('logged');
      users[me.id] = me;
      //--------------------------
      const allmessages = await Msg.find((data) => data).sort({'date': -1}).limit(5);
      socket.emit('displaymessages', allmessages );
      io.sockets.emit('newuser' , me);

    });
    // ON A RECU UN MSG
    socket.on('newmsg' , (message) =>{
      message.user = me;
      message.date = new Date();
      
       // QUAND DB OK DELETE
      let msg = new Msg({user: message.user.username , message: message.message , date: message.date});
      console.log(msg);
        msg.save((err)=>{
          if(!err){
          console.log("Data Bien ajouté.");
          io.sockets.emit('newmsg', msg);
          }
          else{console.log("Error : " +err)}
          // mongoose.connection.close();
        });
       
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
  









