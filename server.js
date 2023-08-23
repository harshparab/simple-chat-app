const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let userCount = 0;

app.use(express.static(__dirname + "/public"));

io.on("connection", (socket) => {
  console.log("User connected");
  userCount += 1;

  socket.on("disconnect", () => {
    console.log("User disconnected");
    userCount -= 1;
  });

  socket.on("chat message", (data) => {
    io.emit("chat message", {
      username: data.username,
      message: data.message,
    });
  });

  socket.on("live user count", () => {
    io.emit("live user count", {
      userCount: userCount,
    });
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
