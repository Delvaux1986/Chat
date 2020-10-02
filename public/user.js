(function($) {
    let socket = io.connect('http://localhost:5000');
    let msgtpl = $('#msgtpl').html();
    $('#msgtpl').remove();
      // COTER CLT


      // LOGIN USER
    $('#loginform').submit((event)=>{
        event.preventDefault();
        socket.emit('login' , {
            username : $('#username').val(),
        }); 
      });

      socket.on('logged' , ()=>{
            $('#loginform').fadeOut();
            $('#message').focus();
          });

      socket.on('newuser' , (me) => {
          console.log(`${me} est connecté`);
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
      // if ($('#messages')[0].childElementCount >= 5) $('#messages')[0].removeChild($('#messages')[0].children[0]);
      $('#messages').append('<div class="message">' + Mustache.render(msgtpl, msg) + '</div>');
    })

    // RECUP DES MESSAGE LORS DE LA CO DE L USER
    socket.on('displaymessages' , (allmessages) =>{
      for(let k = allmessages.length -1 ; k >= 0 ; k--){
        $('#messages').append('<div class="message">' + Mustache.render(msgtpl, allmessages[k]) + '</div>');
      }
    })

  })(jQuery);