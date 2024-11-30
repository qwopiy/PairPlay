const socket = io();

function generateRoomCode() {
    return Math.random().toString(36).substring(2, 7); 
}

document.getElementById('btn').addEventListener('click', () => {
    const roomCode = generateRoomCode();
    socket.emit('create room', roomCode);
    window.location.href = `levelSelect.html?code=${roomCode}`; 
});

document.getElementById('joinForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const roomCode = e.target.room.value;
    socket.emit('join room', roomCode);
    window.location.href = `levelSelect.html?code=${roomCode}`; 
});

socket.on('room created', (roomCode) => {
    document.getElementById('message').innerText = `Room created: ${roomCode}`;
});

socket.on('room joined', (roomCode) => {
    document.getElementById('message').innerText = `Joined room: ${roomCode}`;
});

socket.on('player joined', (message) => {
    document.getElementById('message').innerText += `\n${message}`;
});

socket.on('error', (errorMessage) => {
    alert(errorMessage);
});