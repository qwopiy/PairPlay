const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const sequelize = require('./config/database');
const roomRoutes = require('./routes/rooms');
const Player = require('./models/player');
const Room = require('./models/room');
const RoomPlayer = require('./models/roomPlayer');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());
app.use('/api/rooms', roomRoutes);

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('joinRoom', ({ roomId, username }) => {
    socket.join(roomId);
    socket.to(roomId).emit('message', `${username} has joined the room`);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const startServer = async () => {
  try {
    await sequelize.sync();
    server.listen(3000, () => {
      console.log('Server is running on http://localhost:3000');
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

startServer();