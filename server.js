const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(__dirname + "/public"));

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

  socket.on("chat message", (data) => {
    io.emit("chat message", { username: data.username, message: data.message });
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
