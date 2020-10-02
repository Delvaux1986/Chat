(function($) {
    let socket = io.connect('http://localhost:5000');
    let msgtpl = $('#msgtpl').html();
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
            for(let k = allmessages.length -1 ; k >= 0 ; k--){
              let date = new Date(allmessages[k].date);
              allmessages[k].date = date.getUTCDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " @ " + date.getHours() + "h" + date.getMinutes();
              $('#messages').append('<div class="message message-old">' + Mustache.render(msgtpl, allmessages[k]) + '</div>');
            }
            window.scrollTo(0,document.body.scrollHeight);
          });

      socket.on('newuser' , (me) => {
          console.log(`${me.username} est connecté`);
          return me;

        });
      socket.on('userdisco', (userinchat) =>{
        $('#userinchat').append(`<span class="nombreuser">Il y a ${userinchat} Personne(s) de connectée(s)</span>` );
      })  
      

    // L'utilisateur envoit un message
    $('#tchatinput').submit((event, message) => {
      event.preventDefault();
      socket.emit('newmsg' , {message: $('#message').val() });
      $('#message').val('');
      $('#message').focus();
    });

    // L'utilisateur reçoit le call 'newmsg'
    socket.on('newmsg' , (msg) => {
      // RECUP LE MODEL
      // ET DISPLAY LE MSG
      let date = new Date(msg.date);
      msg.date = date.getUTCDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " @ " + date.getHours() + "h" + date.getMinutes();
      if ($('#messages')[0].childElementCount >= 20) $('#messages')[0].removeChild($('#messages')[0].children[0]);
      $('#messages').append('<div class="message">' + Mustache.render(msgtpl, msg) + '</div>');
      window.scrollTo(0,document.body.scrollHeight);
    })

    // RECUP DES MESSAGE LORS DE LA CO DE L USER
    socket.on('displaymessages' , (allmessages) =>{
      // for(let k = allmessages.length -1 ; k >= 0 ; k--){
      //   let date = new Date(allmessages[k].date);
      //   allmessages[k].date = date.getUTCDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " @ " + date.getHours() + "h" + date.getMinutes();
      //   $('#messages').append('<div class="message message-old">' + Mustache.render(msgtpl, allmessages[k]) + '</div>');
      // }
      // window.scrollTo(0,document.body.scrollHeight);
    });

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







  })(jQuery);