var express = require('express')
var app = express();
var http = require('http').Server(app);
var config = require('./config.js');
// socket.io
var io = require('socket.io')(http);

app.get('/', function(req, res){
    // res.send('<h1>Hola mundo!!</h1>');
    res.sendFile(__dirname+ '/vistas/mi_chat.html')
});
app.use(express.static(__dirname + '/vistas'));

var personas = {};

// socket escuchará la conección
io.on('connection', function(socket){
    io.emit('usuarioID', socket.id);
    console.log('-> usuario conectado');
    socket.on('disconnect', function(){
        io.emit('notificacion', ' usuario "'+socket.id+'" (alias "'+personas[socket.id]+'") se desconectó.');
        console.log('-> usuario desconectado');
    });
    socket.on('mensajeEnviado', function(msg){
        console.log('==> mensaje recibido: '+msg);
        io.emit('mensajeRecibido', personas[socket.id]+' : '+msg);
    });
    socket.on('newUsuarioID', function(nombre){
        console.log('==> nuevo nombre: '+nombre);
        personas[socket.id] = nombre;
        io.emit('notificacion', ' usuario : "'+socket.id+'" conectado como "'+personas[socket.id]+'"');
    });

    // NOTIFICACIONES DE BACKOFFICE
    socket.on('newClienteBO', function(cliente){
        io.emit('notificacion', "Se creó el cliente : '"+cliente.result[0].email+"'");
    });
    socket.on('getClientesBO', function(consulta){
        io.emit('notificacion', consulta);
    });
    socket.on('getClienteBO', function(cliente){
        io.emit('notificacion', "Se consultó al cliente '"+cliente.email+"'.");
    });
    socket.on('editClienteBO', function(cliente){
        io.emit('notificacion', "Se editó la información del cliente '"+cliente.email+"'.");
    });
    socket.on('deleteClienteBO', function(cliente){
        io.emit('notificacion', "Se eliminó al cliente '"+cliente.id+"'.");
    });
})

// se activa el servidor
http.listen(config.puerto, function(){
    console.log('Escuchando en el puerto :'+ config.puerto);
})
