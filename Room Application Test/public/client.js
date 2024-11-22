const socket = io();

document.getElementById('joinRoom').addEventListener('click', () => {
    const username = document.getElementById('username').value;
    const roomId = document.getElementById('roomId').value;

    socket.emit('joinRoom', { roomId, username });
});

socket.on('message', (message) => {
    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML += `<p>${message}</p>`;
});