var express = require('express')
var app = express();
var http = require('http').Server(app);
var config = require('./config.js');
// socket.io
var io = require('socket.io')(http);

app.get('/', function(req, res){
    // res.send('<h1>Hola mundo!!</h1>');
    res.sendFile(__dirname+ '/vistas/chat.html')
});
app.use(express.static(__dirname + '/vistas'));

var personas = {};

// socket escuchará la conección
io.on('connection', function(socket){
    console.log('-> usuario conectado');
    io.emit('usuarioID', socket.id);
    personas[socket.id] = socket.id;
    socket.on('disconnect', function(){
        console.log('-> usuario desconectado');
    });
    socket.on('mensajeEnviado', function(msg){
        console.log('==> mensaje recibido: '+msg);
        io.emit('mensajeRecibido', personas[socket.id]+' : '+msg);
    });
    socket.on('newUsuarioID', function(nombre){
        console.log('==> nuevo nombre: '+nombre);
        personas[socket.id] = nombre;
    });

})

// se activa el servidor
http.listen(config.puerto, function(){
    console.log('Escuchando en el puerto :'+ config.puerto);
})
