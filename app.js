import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';
import { Level1Config } from './public/js/content/level1/config.js';

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
const config = {x: Level1Config.playerStartPosX, y: Level1Config.playerStartPosY};

io.on('connection', (socket) => {
  console.log('a user connected');
  if (currentPlayers < maxPlayers) {
    backEndPlayers[socket.id] = {
      x: config.x,
      y: config.y, 
      isMovingLeft: false, 
      isMovingRight: false,
      isJumping: false
    };
    currentPlayers++;
  }

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
    console.log(key);
    if (key === 'w') {
      backEndPlayers[socket.id].isJumping = true;
    } else if (key === 'a') {
      backEndPlayers[socket.id].isMovingLeft = true;
    } else if (key === 'd') {
      backEndPlayers[socket.id].isMovingRight = true;
    }
  })

  socket.on('keyRelease', (key) => {
    console.log(key);
    if (key === 'w') {
      backEndPlayers[socket.id].isJumping = false;
    } else if (key === 'a') {
      backEndPlayers[socket.id].isMovingLeft = false;
    } else if (key === 'd') {
      backEndPlayers[socket.id].isMovingRight = false;
    }
  })

  // socket.on('update', (pos) => {
  //   // console.log(pos.x, backEndPlayers[socket.id].x);
  //   backEndPlayers[socket.id].x = pos.x;
  //   backEndPlayers[socket.id].y = pos.y;
  // })
});

setInterval(() => {
  io.emit('updatePlayers', backEndPlayers)
  // console.log(backEndPlayers.x, backEndPlayers.y);
}, 15);

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
  console.log( __dirname);
});