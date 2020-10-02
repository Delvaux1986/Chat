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
    });

    // LOGIN 
    socket.on('login' , async (user , req , res)=>{
      try{
            let userinDB =  await User.findOne({username: user.username , password: MD5(user.password)}, (err ,  result)=>{
              if(err){
              console.log('Error : ' +err);
              throw "erreurs";
            }else{
              return result;
            }});
            if(userinDB !== null){
              if(user.username === userinDB.username && MD5(user.password) === userinDB.password){
                me = user;
                users[me.id] = me;
                const allmessages = await Msg.find((data) => data).sort({'date': -1}).limit(10);
                socket.emit('logged', allmessages );
                io.sockets.emit('newuser' , me);
              }
            }else{
              socket.emit('badlogin')
          };
        }catch(err){
          console.log(err);
        }
        });
        
    
    // ON A RECU UN MSG
    socket.on('newmsg' , (message) =>{
      message.user = me;
      message.date = new Date();
      console.log(message);
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
      socket.on('register' , async (user) => {
        let userinDB =  await User.findOne({username: user.username });
        if(userinDB !== null){
          socket.emit('badregister');
        }else{
          let newuser = new User({username: user.username , password: MD5(user.password)});
          newuser.save(async(err)=>{
          if(!err){
            console.log("User bien enregistrer");
            const allmessages = await Msg.find((data) => data).sort({'date': -1}).limit(10);
            socket.emit('logged' , allmessages);
          }else{
            console.log("Error : " +err)
          }
        });
        }
        // VERIF SI USERNAME EXIST DEJA 
        

      })
      
    

    // UN UTILISATEUR SE DECO
    socket.on('disconnect', (userinchat) =>{
      if(!me){
        return false;
      }
      me.id = userinchat--;
      io.sockets.emit('userdisco' , me);
    })
    
  });
  









