var p;
var b;
var balls = [];
var players = [];
var drops = [];
var lastPos;
var go = false;
let socket;
let counter = 0; //Variable para saber cuantos clientes hay conectados y saber en que lado de la pantalla poner a cada uno
var dir;

function setup() {
    socket = io.connect('http://localhost:3000');
    createCanvas(750, 600);
    b = new Ball();
    drop = new Drop(width / 2, height / 2);
    socket.on('getCounter', function(data) { //Debemos desde aqui llamar al getCounter
        counter = data; //Llevamos a counter el tamano de la conexion( este tamano es enviado por el server desde el emit)    
        if (p === undefined) { //Si no se ha instanciado ningun jugador
            if (counter % 2 === 0) {
                p = new Player(0);
                dir = 1;
            } else {
                p = new Player(width); //En su posicion en x le enviamos el ancho para que salga al lado derecho de la pantalla
                dir = -1;
            }
        }
        var data = { //Aqui debemos mandar los datos de cada jugador, luego en el server reimplementaremos como guardar cada jugador en el array players
            x: p.x,
            y: p.y,
            v: p.v,
            w: p.w,
            h: p.h,
            p: p.p
        }
        socket.emit('start', data)

        if (counter === 2) {
            go = true;
        }
    });

    socket.on('heartBeat', function(data) { //Se encarga de refrescar la informacion suministrada por la funcion heartBeat()
        players = data; //Al array de jugadores de le suministra los datos enviados por heartBeat()
    })
}

function draw() {

    background(51);
    rect(width / 2, 0, 10, 600)
    textSize(48);
    fill(0, 102, 153);

    if (go === true) {
        p.show();
        p.move(b);
        b.show();
        b.move();

        for (i = 0; i < drops.length; i++) {
            drops[i].show();
            drops[i].move(dir);
        }


        if (b.collision(p))
            b.xv = 5;

        if (b.x > width) {
            p.points++;
        }

        for (var i = 0; i < players.length; i++) {
            var id = players[i].id;
            if (id !== socket.id) {
                fill(255, 0, 0);
                rectMode(CENTER);
                rect(players[i].x, players[i].y, players[i].w, players[i].h);

            }
        }
        var data = { //Aqui debemos mandar los datos de cada jugador,
            x: p.x,
            y: p.y,
            v: p.v,
            w: p.w,
            h: p.h,
            p: p.p
        }
        socket.emit('update', data)
    }
}



function keyPressed() {
    if (key === ' ') {

        var drop = new Drop(p.x, p.y);
        drops.push(drop);
    }
}