const { Server } = require("socket.io");

let io; // will be initialized later

function initSocket(expressServer) {
  io = new Server(expressServer, {
    cors: {
      origin: 'https://messaging-app-seven-chi.vercel.app',
    },
  });

  io.on("connection", (socket) => {
    console.log(`a user connected ${socket.id}`);

    socket.on("login", (userId) => {
      socket.join(`user:${userId}`);
      console.log(`User ${userId} joined room user:${userId}`);
    });

    socket.on("disconnect", () => {
      console.log(`a user disconnected ${socket.id}`);
    });
    socket.on("loged-out", (data) => {
      socket.broadcast.emit("loged-out", data);
    });
  });

  return io;
}

function getIO() {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
}

module.exports = { initSocket, getIO };
