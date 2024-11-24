import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { randomBytes } from 'crypto';
import path from 'path';

const app = express();
const server = createServer(app);
const io = new Server(server, { pingInterval: 2000, pingTimeout: 500 });

// Store rooms and their players
const rooms = {};

// Serve the lobby HTML file
app.get('/lobby', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'lobby.html')); // Adjusted for correct path
});

// Handle socket connections
io.on('connection', (socket) => {
  console.log('A user connected to the lobby');

  // Create a room
  socket.on('createRoom', () => {
    const roomCode = randomBytes(3).toString('hex'); // Generate a random room code
    rooms[roomCode] = { players: {} }; // Initialize the room
    rooms[roomCode].players[socket.id] = { playerNumber: 1 }; // Track the creator
    socket.join(roomCode); // Add the creator to the room
    socket.emit('roomCreated', roomCode); // Send room code back to the creator
    console.log(`Room created: ${roomCode}`);
  });

  // Join a room
  socket.on('joinRoom', (roomCode) => {
    if (rooms[roomCode]) {
      socket.join(roomCode); // Add the player to the room
      const playerNumber = Object.keys(rooms[roomCode].players).length + 1;
      rooms[roomCode].players[socket.id] = { playerNumber }; // Track players
      io.to(roomCode).emit('playerJoined', { id: socket.id, playerNumber }); // Notify room of new player
      console.log(`Player ${socket.id} joined room: ${roomCode}`);
    } else {
      socket.emit('roomNotFound', roomCode); // Notify if room does not exist
    }
  });

  // Handle player disconnect
  socket.on('disconnect', () => {
    for (const roomCode in rooms) {
      if (rooms[roomCode].players[socket.id]) {
        delete rooms[roomCode].players[socket.id]; // Remove player from room
        io.to(roomCode).emit('playerDisconnected', socket.id); // Notify room of disconnection
        console.log(`Player ${socket.id} disconnected from room: ${roomCode}`);
        break;
      }
    }
  });
});

// Start the server
server.listen(3001, () => {
  console.log('Lobby server running at http://localhost:3001');
});