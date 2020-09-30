(function($) {
    let socket = io.connect('http://localhost:5000');
    let msgtpl = $('#msgtpl').html();
    $('#msgtpl').remove();


      // LOGIN USER
    $('#loginform').submit((event)=>{
        event.preventDefault();
        socket.emit('login' , {
            username : $('#username').val(),
        }); 
      });

      socket.on('logged' , ()=>{
            $('#login').fadeOut();
            $('#message').focus();
          });

      socket.on('newuser' , () => {
          alert(`un utilisateur est connecté`);
        });
      socket.on('userdisco', (userinchat) =>{
        $('#userinchat').append(`<span class="nombreuser">Il y a ${userinchat} Personne(s) de connectée(s)</span>` );
      })  
      

        // ENVOI MSG
    $('#tchatinput').submit((event) => {
      event.preventDefault();
      socket.emit('newmsg' , {message: $('#message').val() });
      $('#message').val('');
      $('#message').focus();
    });

    socket.on('newmsg' , (message)=>{
      $('#messages').append('<div class="message">' + Mustache.render(msgtpl, message) + '</div>');
    })



  })(jQuery);