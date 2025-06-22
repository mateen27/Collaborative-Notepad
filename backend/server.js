const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://collaborative-notepad-olive.vercel.app",
    methods: ["GET", "POST"],
    credentials: true
  },
});


const rooms = {};
const roomTimers = {};
const roomPasswords = {};

io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("join-room", ({ roomId, password }) => {
    if (roomPasswords[roomId] && roomPasswords[roomId] !== password) {
      socket.emit("auth-failed");
      return;
    }

    if (!roomPasswords[roomId] && password && password.trim() !== "") {
      roomPasswords[roomId] = password;
    }

    socket.join(roomId);
    console.log(`Socket ${socket.id} joined ${roomId}`);

    if (!rooms[roomId]) rooms[roomId] = "";
    socket.emit("load-text", rooms[roomId]);

    socket.on("update-text", (text) => {
      rooms[roomId] = text;
      socket.to(roomId).emit("load-text", text);
    });

    socket.on("set-password", ({ roomId, password }) => {
      roomPasswords[roomId] = password;
    });

    socket.on("disconnect", () => {
      setTimeout(() => {
        const clients = io.sockets.adapter.rooms.get(roomId);
        if (!clients || clients.size === 0) {
          roomTimers[roomId] = setTimeout(() => {
            delete rooms[roomId];
            delete roomPasswords[roomId];
          }, 5 * 60 * 1000);
        }
      }, 1000);
    });
  });
});

server.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});