import express from 'express';
import http from 'http';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';
import pkg from 'pg';
const { Pool, Client } = pkg;

// ubah nanti karena /*unsafe*/
// const pool = new Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'game',
//   password: 'eeklalat05',
//   port: 5432,
// });

// (async function query() { 
//   const client = await pool.connect()
//   try {
//     const res = await client.query('SELECT * FROM pemain');
//     // node .log(res.rows);
//   } catch (err) {
//     console.log(err);
//   } finally {
//     client.release();
//   }
// })();
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'game',
  password: 'eeklalat05',
  port: 5432,
});

(async function query() { 
  const client = await pool.connect()
  try {
    const res = await client.query('SELECT * FROM pemain');
    // console.log(res.rows);
  } catch (err) {
    console.log(err);
  } finally {
    client.release();
  }
})();

const app = express();
const server = createServer(app);
const io = new Server(server, { pingInterval: 2000, pingTimeout: 500 });

app.get('/public/game/createRoom.html', (req, res) => {
  res.sendFile(join(__dirname, '/public/game/createRoom.html'));
});

app.get('/public/game/levelSelect', (req, res) => {
  res.sendFile(join(__dirname, '/public/game/levelSelect.html'));
});
app.get('/public/game/gameLocal.html', (req, res) => {
  res.sendFile(join(__dirname, '/public/game/gameLocal.html'));
});
app.get('/public/game/1.html', (req, res) => {
  res.sendFile(join(__dirname, '/public/game/1.html'));
});
app.get('/public/game/2.html', (req, res) => {
  res.sendFile(join(__dirname, 'public/game/2.html'));
});
app.get('/public/game/3.html', (req, res) => {
  res.sendFile(join(__dirname, 'public/game/3.html'));
});
app.get('/public/game/4.html', (req, res) => {
  res.sendFile(join(__dirname, 'public/game/4.html'));
});

const __dirname = dirname(fileURLToPath(import.meta.url));

const httpServer = http.createServer(app);
httpServer.listen(app.get('http_port'), function(){
  console.log('httpServer listening on port %d', app.get('http_port'));
});

io.attach(httpServer);

app.use(express.static(__dirname));

const maxPlayers = 2;
var currentPlayers = 0;
const backEndPlayers = {};
const config = {x: 100, y: 100};
var key = false;
var win1 = false;
var win2 = false;
var inLevel = false;
var progress = 4;

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('create room', (roomCode) => {
      socket.join(roomCode);
      socket.emit('room created', roomCode);
      console.log(`Room created: ${roomCode}`);
  });

  socket.on('join room', (roomCode) => {
      const rooms = Object.keys(socket.rooms);
      if (!rooms.includes(roomCode)) {
          socket.join(roomCode);
          socket.emit('room joined', roomCode);
          console.log(`User  joined room: ${roomCode}`);
          socket.to(roomCode).emit('player joined', `A new player has joined room ${roomCode}`);
      } else {
          socket.emit('error', 'You are already in this room');
      }
  });

  io.emit('progress', progress);
  socket.on('inLevel', (bool) => {
    inLevel = bool;
  })

  socket.on('level', (num, code) => {
    io.emit('level', num, code);
  })

  if (currentPlayers < maxPlayers) {
    backEndPlayers[socket.id] = {
      x: config.x + (currentPlayers * 16),
      y: config.y, 
      isMovingLeft: false, 
      isMovingRight: false,
      isJumping: false,
      death: 0,
      playerNumber: currentPlayers + 1
    };
    currentPlayers++;
  }

  if (!inLevel) 
    io.emit('updatePlayers', backEndPlayers)

  socket.on('createPlayer', () => {
    io.emit('createPlayer', backEndPlayers);
  })

  socket.on('exit', () => {
    io.emit('exit');
  })

  socket.on('disconnect', (reason) => {
    console.log(reason)
    io.emit('disconnected', socket.id)
    delete backEndPlayers[socket.id]
    io.emit('updatePlayers', backEndPlayers)
    currentPlayers--;
  })

  socket.on('keyPress', (key) => {
    switch (key) {
      case 'w':
        backEndPlayers[socket.id].isJumping = true;
        break;
      case 'a':
        backEndPlayers[socket.id].isMovingLeft = true;
        break;
      case 'd':
        backEndPlayers[socket.id].isMovingRight = true;
        break;
      case 'r':
        for (const id in backEndPlayers) {
          backEndPlayers[id].x = config.x;
          backEndPlayers[id].y = config.y;
        };
        
        io.emit('respawn');
        break;
    }
  })

  socket.on('keyRelease', (key) => {
    switch (key) {
      case 'w':
        backEndPlayers[socket.id].isJumping = false;
        break;
      case 'a':
        backEndPlayers[socket.id].isMovingLeft = false;
        break;
      case 'd':
        backEndPlayers[socket.id].isMovingRight = false;
        break;
    }
  })

  socket.on('update', (pos) => {
    // console.log(pos.x, backEndPlayers[socket.id].x);
    backEndPlayers[socket.id].x = pos.x;
    backEndPlayers[socket.id].y = pos.y;
    io.emit('updateLocation', {x: backEndPlayers[socket.id].x, y: backEndPlayers[socket.id].y}, socket.id)
  })

  socket.on('portal', () => {
    io.emit('updateLocation', {x: backEndPlayers[socket.id].x, y: backEndPlayers[socket.id].y}, socket.id)
  })  

  socket.on('respawning', () => {
    setTimeout(() => {
      for (const id in backEndPlayers) {
        backEndPlayers[id].x = config.x;
        backEndPlayers[id].y = config.y;
      };
  
      backEndPlayers[socket.id].death++;
      io.emit('respawn');
  
      for (const id in backEndPlayers) {
        console.log(id + '.death : ' + backEndPlayers[id].death);
      }
    }, 3000);
  })

  socket.on('key', () => {
    if (key == false) {
      console.log('key');
      io.emit('keyGet');
      key = true;
    }
  })

  socket.on('door', () => {
    if (key == true) {
      console.log('door');
      key = false;
    }
  })

  socket.on('win', (num) => {
    eval('win' + num + ' = true');
  })
});

setInterval(() => {
  if (!inLevel) return;
  io.emit('updatePlayers', backEndPlayers);
  // console.log(backEndPlayers.x, backEndPlayers.y);
  if (win1 && win2) {
    for (const id in backEndPlayers) {
      delete backEndPlayers[id]
    }
    console.log('win');
    io.emit('nextLevel');
    win1 = false;
    win2 = false;
  }
}, 15);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

server.listen(3000, () => {
console.log('server running at http://localhost:3000');
console.log(__dirname);
});