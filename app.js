import express from 'express';
import phpExpress from 'php-express';
import http from 'http';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';
import { exec } from 'node:child_process';
import { spawn } from 'node:child_process';

const php = phpExpress({
  binPath: 'C:\\xampp\\php\\php.exe' 
});

const app = express();
const server = createServer(app);
const io = new Server(server, { pingInterval: 2000, pingTimeout: 500 });

const __dirname = dirname(fileURLToPath(import.meta.url));

const httpServer = http.createServer(app);
httpServer.listen(app.get('http_port'), function(){
  console.log('httpServer listening on port %d', app.get('http_port'));
});

io.attach(httpServer);
app.set('views', '/public');
app.engine('php', php.engine);
app.set('view engine', 'php');
app.set(/.+\.php$/, php.router);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  exec("php ./public/index.php", function (error, stdout, stderr) {
    res.send(stdout);
  });
});
app.get("/public/index.php", function (req, res) {
  exec("php ./public/index.php", function (error, stdout, stderr) {
    res.send(stdout);
  });
});

app.get("/public/registration/login.php", function (req, res) {
  exec("php ./public/registration/login.php", function (error, stdout, stderr) {
    res.send(stdout);
  });
});

app.get("/public/registration/logout.php", function (req, res) {
  exec(
    "php ./public/registration/logout.php",
    function (error, stdout, stderr) {
      res.send(stdout);
    }
  );
});
app.get("/public/profilePage/profile.php", function (req, res) {
  exec(
    "php ./public/profilePage/profile.php",
    function (error, stdout, stderr) {
      res.send(stdout);
    }
  );
});

app.get("/public/registration/signup.php", function (req, res) {
  exec(
    "php ./public/registration/signup.php",
    function (error, stdout, stderr) {
      res.send(stdout);
    }
  );
});

app.post('/public/registration/login.php', (req, res) => {
  
  const phpProcess = spawn('php', ['./public/registration/login.php'], {
    env: {
      ...process.env,
      REQUEST_METHOD: 'POST',
      CONTENT_TYPE: 'application/json',
      HTTP_HOST: req.headers.host,
      HTTP_USER_AGENT: req.headers['user-agent'],
      REMOTE_ADDR: req.ip,
      REQUEST_URI: req.originalUrl,
      QUERY_STRING: new URLSearchParams(req.query).toString()
    }
  });
  
  const postData = req.body;
  let phpOutput = '';

  phpProcess.stdout.on('data', (data) => {
    phpOutput += data.toString();
  });

  phpProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  phpProcess.on('close', (code) => {
    res.send(phpOutput);
  });

  phpProcess.stdin.write(JSON.stringify(postData));
  phpProcess.stdin.end();
});
app.post('/public/registration/signup.php', (req, res) => {
  
  const phpProcess = spawn('php', ['./public/registration/signup.php'], {
    env: {
      ...process.env,
      REQUEST_METHOD: 'POST',
      CONTENT_TYPE: 'application/json',
      HTTP_HOST: req.headers.host,
      HTTP_USER_AGENT: req.headers['user-agent'],
      REMOTE_ADDR: req.ip,
      REQUEST_URI: req.originalUrl,
      QUERY_STRING: new URLSearchParams(req.query).toString()
    }
  });
  
  const postData = req.body;
  let phpOutput = '';
  
  phpProcess.stdout.on('data', (data) => {
    phpOutput += data.toString();
  });

  phpProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  phpProcess.on('close', (code) => {
    res.send(phpOutput);
  });

  phpProcess.stdin.write(JSON.stringify(postData));
  phpProcess.stdin.end();
});

app.use(express.static(__dirname));

// app.get('/', (req, res) => {
//   res.sendFile(join(__dirname, "/public/index.php"));
// });

// set up php-express


app.use(express.static(join(__dirname, 'public')));

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

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

server.listen(3000, () => {
console.log('server running at http://localhost:3000');
console.log(__dirname);
});