const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(__dirname));

io.on("connection", (socket) => {
  console.log(`A user connected:`, socket.id);

  socket.on(`chat message`, (data) => {
    io.emit(`chat message`, data);
  });

  socket.on("typing", ( username ) => {
    socket.broadcast.emit('typing',username );
  });

  socket.on("disconnect", () => {
    console.log(`a user disconnected`, socket.id);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
});
