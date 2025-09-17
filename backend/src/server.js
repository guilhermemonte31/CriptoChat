import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { Server } from "socket.io";
import socketHandler from "./socket.js";
import messagesRoutes from "./routes/messages.js";

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json());

// API REST para mensagens (busca / paginação / criar)
app.use("/messages", messagesRoutes);

app.get("/", (req, res) => res.send("Servidor CriptoChat com MongoDB e Socket.IO"));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

socketHandler(io);

const PORT = process.env.PORT || 3001;

// Conectando ao MongoDB antes de subir o servidor
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Conectado ao MongoDB");
    server.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
  })
  .catch((err) => {
    console.error("Erro ao conectar no MongoDB:", err);
    process.exit(1);
  });

// Rota de teste
app.get("/", (req, res) => {
  res.send("Servidor CriptoChat está rodando!");
});
