(function($) {
    let socket = io.connect();
    let msgtpl = $('#msgtpl').html();
    let userinchattpl = $('#usersinchat').html();
    let user = "";
    $('#msgtpl').remove();
      // COTER CLT


      // LOGIN USER
    $('#loginform').submit((event)=>{
        event.preventDefault();
        socket.emit('login' , {
            username : $('#usernamelogin').val(),
            password : $('#passwordlogin').val()
        }); 
      });

      socket.on('logged' , (allmessages)=>{
            $('#loginform').fadeOut();
            $('#registerform').fadeOut();
            $('#tchatinput').fadeIn();
            $('#message').focus();
            $('#btndisc').fadeIn();
            user = $('#usernamelogin').val();
            for(let k = allmessages.length -1 ; k >= 0 ; k--){
              let date = new Date(allmessages[k].date);
              allmessages[k].date = date.getUTCDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " @ " + date.getHours() + "h" + date.getMinutes();
              if (user === allmessages[k].user) {
                $('#messages').append('<div class="message message-old message-self">' + Mustache.render(msgtpl, allmessages[k]) + '</div>');
              } else {
                $('#messages').append('<div class="message message-old">' + Mustache.render(msgtpl, allmessages[k]) + '</div>');
              }
            }
            window.scrollTo(0,document.body.scrollHeight);
          });

      socket.on('newuser' , (me) => {
        $('#messages').append(`<span> ${me.username} vient de se connecter .</span>`);
        console.log(`${me.username} vient de se connecter .`);

        });
      socket.on('userdisco', (userinchat) =>{
        $('#userinchat').append(`<span class="nombreuser">Il y a ${userinchat} Personne(s) de connectée(s)</span>` );
      })  
      

    // L'utilisateur envoit un message
    $('#tchatinput').submit((event, message) => {
      event.preventDefault();
      socket.emit('newmsg' , {message: $('#message').val() , user: user });
      $('#message').val('');
      $('#message').focus();
    });

    // L'utilisateur reçoit le call 'newmsg'
    socket.on('newmsg' , (msg) => {
      console.log(msg);
      let date = new Date(msg.date);
      msg.date = date.getUTCDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " @ " + date.getHours() + "h" + date.getMinutes();
      if ($('#messages')[0].childElementCount >= 20) $('#messages')[0].removeChild($('#messages')[0].children[0]);
      if (user === msg.user) {
        $('#messages').append('<div class="message message-self">' + Mustache.render(msgtpl, msg) + '</div>');
      } else {
        $('#messages').append('<div class="message">' + Mustache.render(msgtpl, msg) + '</div>');
      }
      window.scrollTo(0,document.body.scrollHeight);
    })


    // Inscription
    $('#registerform').submit((event) =>{
      event.preventDefault();

      socket.emit('register', {username: $('#usernameregister').val() , password: $('#passwordregister').val()});
      $('#usernameregister').val('');
      $('#passwordregister').val('');
      $('#message').focus();
    })
    // BAD LOGIN OR PASSWORD FOR USER 
    socket.on('badlogin', () =>{
      $('#errorlogin').append('Mauvais login ou password !!!');
    })
    // BAD REGISTER ALLREADY EXIST
    socket.on('badregister', ()=>{
      $('#errorregister').append('Ce pseudo éxiste déja !!!');

    })
    // LIST PPL ON CHAT 
    socket.on('userlistchange', (userlist) => {
      $('#usersinchat').empty();
        userlist.forEach(element => {
          $('#usersinchat').append(`<li><svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-person-square" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M14 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
          <path fill-rule="evenodd" d="M2 15v-1c0-1 1-4 6-4s6 3 6 4v1H2zm6-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
          </svg>  </i>${element} </li>`);
      });
      
      
      
    })
    // USER GONNA DISCONNECTED
    $('#discbtn').submit((event) => {
      event.preventDefault();
      $('#messages').fadeOut();   
      socket.emit('thisuserdisco', {user: user});
      location.reload();
    })
    






  })(jQuery);