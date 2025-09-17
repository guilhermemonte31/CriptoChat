import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        user: { type: String, required: true, index: true },
        text: { type: String, required: true },
        room: { type: String, default: "global", index: true },
        createdAt: { type: Date, default: Date.now, index: true }
    },
    { versionKey: false }
);

// Índice composto para consultas por sala e ordenação por data
messageSchema.index({ room: 1, createdAt: -1 });

// Usa o modelo já existente OU cria um novo
const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);

export default Message;