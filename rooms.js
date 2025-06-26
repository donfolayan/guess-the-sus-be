const rooms = {};
const GAME_LIMITS = {
  imposters: 12,
  spyfall: 10,
  drawing: 5
};

function createRoom(roomID, gameType, socketId) {
  if (rooms[roomID]) return false;
  rooms[roomID] = { gameType, players: [socketId] };
  return true;
}

function joinRoom(roomID, socketId) {
  const room = rooms[roomID];
  if (!room) return false;
  if (room.players.length >= GAME_LIMITS[room.gameType]) return false;
  room.players.push(socketId);
  return true;
}

function leaveRoom(roomID, socketId) {
  const room = rooms[roomID];
  if (!room) return;
  room.players = room.players.filter(id => id !== socketId);
  if (room.players.length === 0) delete rooms[roomID];
}

module.exports = { rooms, GAME_LIMITS, createRoom, joinRoom, leaveRoom }; 