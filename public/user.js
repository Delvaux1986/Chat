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
      

        // ENVOI MSG
    $('#tchatinput').submit((event, message) => {
      event.preventDefault();
      socket.emit('newmsg' , {message: $('#message').val() });
      $('#message').val('');
      $('#message').focus();
    });

    // socket.on('newmsg' , (message)=>{
    //   $('#messages').append('<div class="message">' + Mustache.render(msgtpl, message) + '</div>');
    // })
    socket.on('newmsg' , (msg) => {
      // RECUP LE MODEL
      // ET DISPLAY LE MSG
      $('#messages').append('<div class="message">' + Mustache.render(msgtpl, msg) + '</div>');
    })

    // RECUP DES MESSAGE LORS DE LA CO DE L USER

    socket.on('displaymessages' , (allmessages) =>{
      for(let k = allmessages.length -1 ; k >= 0 ; k--){
        $('#messages').append('<div class="message">' + Mustache.render(msgtpl, allmessages[k]) + '</div>');
      }
    })

  })(jQuery);