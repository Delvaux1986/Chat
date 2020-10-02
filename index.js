#!/usr/bin/env node
const mongoose = require('mongoose');
const Msg = require('./models/Message');
const User = require('./models/User');
let express = require('express');
const MD5 = require('MD5');
let app = express();
var cookieParser = require('cookie-parser');
var session = require('express-session');
const redis = require('redis');
const redisStore = require('connect-redis')(session);
let path = require('path');
const md5 = require('MD5');
let server = require('http').createServer(app);
let io = require('socket.io')(server);
const port =  5000;
let msg ;
let sess;

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


// ON REND LE SERV STATIC ON INIT COOKIEPARSER ET EXPRESS SESSION
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());


// PAGE D ACCEUIL

app.get('/', (req, res) => {
  let sess = req.session;
    if(sess.email) {
        return res.redirect(__dirname + '/views/admin');
    }
    res.sendFile(__dirname + '/public/index.html');
});

  



io.on('connection', (socket , me) => {
    console.log(`PPL as Connected .`);
    
    socket.on('disconnect', () => {
      console.log(`PPL disconnected`);
    });
  });




io.sockets.on('connection', (socket) => {
    
    for(let k in users){
        socket.emit('newuser', users[k]);
    }

    socket.on('newuser', () =>{
      $('#userinchat').append('<img src="' + user.avatar + '" id="' + user.id + '">');
    })

    // LOGIN 
    socket.on('login' , async (user , req , res)=>{
      me = user;
      
      socket.emit('logged');
      users[me.id] = me;
      //--------------------------
      const allmessages = await Msg.find((data) => data).sort({'date': -1}).limit(10);
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
  









