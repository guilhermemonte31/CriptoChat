import express from "express";
import { Server } from "socket.io";
import http from "http";

const app = express();
const server = http.createServer(app);
const publicKeys = {};

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // URL do frontend Vite
    methods: ["GET", "POST"]
  },
});

// Função auxiliar para obter usuários online
const getOnlineUsers = () => {
  return Array.from(io.sockets.sockets.values())
    .filter(socket => socket.username)
    .map(socket => socket.username);
};

io.on("connection", (socket) => {
  console.log(`Usuário conectado: ${socket.id}`);

  // Evento de entrada do usuário
  socket.on("user_join", (username) => {
    socket.username = username;
    const users = getOnlineUsers();
    io.emit("users_update", {users, publicKeys});
    
    // Notifica outros usuários
    socket.broadcast.emit("user_joined", username);
  });

  socket.on("public_key", ({username, publicKey}) => {
    publicKeys[username] = publicKey;
    io.emit("users_update", {users: getOnlineUsers(), publicKeys});
  });

  // Evento de mensagem
  socket.on("send_message", (message) => {
    console.log(message);
    socket.broadcast.emit("receive_message", message);
  });

  // Evento de desconexão
  socket.on("disconnect", () => {
    if (socket.username) {
      delete publicKeys[socket.username];
      console.log(`Usuário desconectado: ${socket.username}`);
      const users = getOnlineUsers();
      io.emit("users_update", {users, publicKeys});
      socket.broadcast.emit("user_left", socket.username);
    }
  });

  // Evento de digitação
  socket.on("typing", (isTyping) => {
    socket.broadcast.emit("user_typing", {
      username: socket.username,
      isTyping
    });
  });
});

// Rota básica para verificar se o servidor está rodando
app.get("/", (req, res) => {
  res.send("Servidor CriptoChat está rodando!");
});

// Inicialização do servidor
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});