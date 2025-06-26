const { rooms, createRoom, joinRoom, leaveRoom } = require('./rooms');

function registerSocketHandlers(io, socket) {
  socket.on('create-room', ({ roomID, gameType }, callback) => {
    if (!createRoom(roomID, gameType, socket.id)) {
      callback({ success: false, message: 'Room already exists' });
    } else {
      socket.join(roomID);
      callback({ success: true, roomID });
      socket.to(roomID).emit('player-joined', { socketId: socket.id, roomID });
      console.log(`Room ${roomID} (${rooms[roomID].gameType}) created by user ${socket.id}`);
    }
  });

  socket.on('join-room', (roomID, callback) => {
    if (!joinRoom(roomID, socket.id)) {
      callback({ success: false, message: 'Room does not exist or is full' });
    } else {
      socket.join(roomID);
      callback({ success: true, roomID });
      socket.to(roomID).emit('player-joined', { socketId: socket.id, roomID });
      console.log(`User ${socket.id} joined room ${roomID}`);
    }
  });

  socket.on('disconnect', () => {
    for (const roomID in rooms) {
      if (rooms[roomID].players.includes(socket.id)) {
        leaveRoom(roomID, socket.id);
        socket.to(roomID).emit('player-left', { socketId: socket.id, roomID });
        console.log(`User ${socket.id} left room ${roomID}`);
      }
    }
    console.log('A user disconnected', socket.id);
  });
}

module.exports = { registerSocketHandlers }; 