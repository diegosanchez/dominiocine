/*
*/
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var buffer = '';
var mongo = require("mongojs");
var db = mongo('mydb', ["chatshistory"]);


module.exports = function(namesala, admin, invitados){


for(var x=0; x<invitados.length; x++)
{
    console.log(invitados[x]);
}

console.log("the admin is" + admin);


setInterval(function(){
      console.log("save data from chat");
      db.chatshistory.save({"chat of " : sala , "chat:" : buffer + "\n"});
}, 4000);




var usr = "ale", sala = namesala; 
// TODO: persistir usuarios por sala.
// si la sala no existe, crearla y guardar el usuario.
// tener ahi los usuarios conectados 
// salas -> arr sala
// sala -> obj {Name, inicio, fin, invitados, moderador, chat}
// invitado{name, idSocket, viendo}
// chat 

app.get('/', function(req, res){
      res.sendFile(__dirname + '/index.html');
});


  io.on('connection', function(socket){
  
  socket.join(sala);
  console.log(usr, " se unio a la sala ", sala);
  //a todos menos el emisor
  

  socket.broadcast.to(sala).emit('chat', "El administrador de la sala es: " + admin);
  socket.broadcast.to(sala).emit('chat', usr + " se unio a la sala "+ sala);
  
  socket.on('chat', function(msg){
  	
  	// a todos
  	io.sockets.in(sala).emit('chat',usr+":"+ msg);
    console.log(msg);
    buffer += msg + "\n";
  });
  socket.on('disconnect', function(){
  	
    console.log(usr, ' SE DESCONECTO');
    socket.broadcast.to(sala).emit('chat', usr + " se desconecto ");
    db.chatshistory.save({"chat of " : sala , "chat:" : buffer});
    
  });
  
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

}