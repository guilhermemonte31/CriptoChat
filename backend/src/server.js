import express from "express";
import { Server } from "socket.io";
import http from "http";
const app = express();
const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("Novo cliente conectado:", socket.id);

  socket.on("send_message", (data) => {
    console.log(data.text);
    console.log("Mensagem recebida:", data);

    
    socket.broadcast.emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
  });
});

server.listen(3001, () => {
  console.log("Servidor rodando na porta 3001");
});
