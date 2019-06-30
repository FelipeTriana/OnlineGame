const express = require('express');
const app = express();
const path = require('path');
var connections = [];
var players = [];

function Player(id, x, y, v, w, h, p) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.v = v;
    this.w = w;
    this.h = h;
    this.p = p;
}

//Settings
app.set('port', process.env.PORT || 3000);

//Static files
app.use(express.static(path.join(__dirname, 'public'))); //Hostear clientes en la carpeta public

//Start the server
const server = app.listen(app.get('port'), () => {
    console.log(`Server on port: ${app.get('port')}`);
})


//Websockets, cuando alguien se conecte ejecutara la funcion flecha
const socketIO = require('socket.io');
const io = socketIO(server); //io mantiene la conexion de sockets

/*
getCounter es un contador que nos va diciendo cuantos jugadores se han conectado a la sesion.
El cliente accedera a la funcion getCounter
*/
function getCounter() {
    io.sockets.emit('getCounter', connections.length) //Sending length of connections
}

/*Necesitamos una funcion para que cada vez que se mueva un jugador el servidor le envie la informacion nueva
a los clientes, sus nuevas coordenadas, para que se vea en tiempo real los cambios, esta funcion debe actualizar
la informacion de los jugadores y al cliente le llegue la informacion de lo que esta pasando*/

function heartBeat() {
    io.sockets.emit('heartBeat', players);
}
setInterval(heartBeat, 33);

/*
*Cada vez que se haga una conexion  se agregara un socket
al array 'connections'
*/

io.sockets.on('connection', function(socket) {
    connections.push(socket);
    console.log('Un usuario se ha conectado ' + socket.id + 'Numero de conexion: ' + connections.length);
    getCounter(); //Cuando un cliente se conecta automaticamente le decimos cuantos jugadores hay

    socket.on('start', (data) => {
        var p = new Player(socket.id, data.x, data.y, data.v, data.w, data.h, data.p);

        for (var i = 0; i < players.length - 1; i++) {
            for (var j = i + 1; j < players.length; j++) {
                if (players[i].id === players[j].id) {
                    players.pop(j);
                }
            }
        }
        players.push(p);
        console.log('Socket: ' + players[i].id + ' Jugadores: ' + players.length);

    })



    socket.on('update', function(data) {
        var pl;
        for (var i = 0; i < players.length; i++) {
            if (socket.id === players[i].id)
                pl = players[i];
        }
        pl.x = data.x;
        pl.y = data.y;
        pl.v = data.v;
        pl.w = data.w;
        pl.h = data.h;
        pl.p = data.p;

    })
});