const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const uuid = require('uuid');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const rooms = {};

app.use(express.static(__dirname + '/public'));

app.get('/create', (req, res) => {
    const roomCode = uuid.v4().slice(0, 6); 
    rooms[roomCode] = { host: null, players: [] };
    res.redirect(`/room/${roomCode}`);
});

app.get('/room/:roomCode', (req, res) => {
    const roomCode = req.params.roomCode;
    if (rooms[roomCode]) {
        res.sendFile(__dirname + '/public/room.html');
    } else {
        res.status(404).send('Room not found');
    }
});

io.on('connection', (socket) => {
    socket.on('createRoom', () => {
        const roomCode = uuid.v4().slice(0, 6);
        rooms[roomCode] = { host: socket.id, players: [socket.id] };
        socket.join(roomCode);
        socket.emit('roomCreated', roomCode);
        socket.emit('waitingForPlayer'); 
    });

    socket.on('joinRoom', (roomCode) => {
        if (rooms[roomCode] && rooms[roomCode].players.length < 2) {
            rooms[roomCode].players.push(socket.id);
            socket.join(roomCode);
            socket.emit('roomJoined', roomCode);
            socket.emit('youJoinedRoom'); 

            io.to(rooms[roomCode].host).emit('playerJoined');
        } else {
            socket.emit('error', 'Room not available');
        }
    });

    socket.on('disconnect', () => {
        for (const [roomCode, room] of Object.entries(rooms)) {
            if (room.players.includes(socket.id)) {
                room.players = room.players.filter(id => id !== socket.id);
                if (room.players.length === 0) {
                    delete rooms[roomCode]; 
                } else if (room.host === socket.id) {
                    room.host = room.players[0]; 
                    io.to(room.host).emit('waitingForPlayer'); 
                }
            }
        }
    });
});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
