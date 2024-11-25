const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

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

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});