const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { registerSocketHandlers } = require('./socketHandlers');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    }
});

app.get('/', (req, res) => {
    res.send('Backend server with socket.io is running');
});

// Store rooms and players (in-memory)
const rooms = {}; //{roomID: { gameType, players: [socketID, socketID, ...] }}
const GAME_LIMITS = {
    imposters: 12,
    spyfall: 10,
    drawing: 5
};

io.on('connection', (socket) => {
    console.log('A user connected', socket.id);
    registerSocketHandlers(io, socket);
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
