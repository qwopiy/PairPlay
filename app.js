import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server, { pingInterval: 2000, pingTimeout: 500 });

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

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
  // socket.emit('init', backEndPlayers[socket.id]);
  io.emit('progress', progress);
  socket.on('inLevel', (bool) => {
    inLevel = bool;
  })

  socket.on('level', (num) => {
    io.emit('level', num);
  })
  
  console.log('a user connected');

  // socket.on('init', () => {
  //   if (currentPlayers < maxPlayers) {
  //     backEndPlayers[socket.id] = {
  //       x: config.x + (currentPlayers * 16),
  //       y: config.y, 
  //       isMovingLeft: false, 
  //       isMovingRight: false,
  //       isJumping: false,
  //       death: 0,
  //       playerNumber: currentPlayers + 1
  //     };
  //     currentPlayers++;
  //   }
  //   console.log(backEndPlayers);
  //   socket.emit('init', backEndPlayers[socket.id]);
  // })
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

  console.log(backEndPlayers);

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
    // issue: currentplayer gak konsisten kalau server open sebelum client close window sebelumnya
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

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
  console.log( __dirname);
});