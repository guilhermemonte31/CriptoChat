import Message from "./models/message.js";

export default function socketHandler(io) {

    const onlineUsers = new Map();

    const getOnlineUsernames = () => Array.from(onlineUsers.keys());

    io.on("connection", (socket) => {
        console.log(`Usuário conectado: ${socket.id}`);

        socket.on("user_join", (username) => {
            socket.username = username;
            onlineUsers.set(username, socket.id);

            io.emit("users_update", getOnlineUsernames());
            socket.broadcast.emit("user_joined", username);
        });

        socket.on("join_room", (room) => {
            socket.join(room);
        });


        socket.on("leave_room", (room) => {
            socket.leave(room);
        });

        // Recebendo mensagem do cliente, salvando no MongoDB e emitindo a mensagem para o chat
        // Payload no formato: { user, text, room }
        socket.on("send_message", async (payload) => {
            try {
                const { user, text, room = "global" } = payload;
                const message = new Message({ user, text, room });
                await message.save();

                // emite a mensagem para todos na sala (inclui remetente)
                io.emit("receive_message", message);
            } catch (err) {
                console.error("Erro ao salvar mensagem:", err);
                socket.emit("error", { message: "Não foi possível salvar a mensagem" });
            }
        });

        socket.on("typing", ({ room = "global", isTyping }) => {
            socket.broadcast.emit("user_typing", {
                username: socket.username,
                isTyping
            });
        });

        socket.on("disconnect", () => {
            if (socket.username) {
                onlineUsers.delete(socket.username);
                io.emit("users_update", getOnlineUsernames());
                socket.broadcast.emit("user_left", socket.username);
            }
            console.log(`Usuário desconectado: ${socket.username}`);
        });

    });
}
