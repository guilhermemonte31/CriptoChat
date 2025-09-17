import express from "express";
import Message from "../models/message.js";

const router = express.Router();

// GET - buscar mensagens em ordem cronológica (mais antigas primeiro)
router.get("/", async (req, res) => {
    try {
        const room = req.query.room || "global";
        const limit = Math.min(parseInt(req.query.limit) || 50, 200);
        const before = req.query.before ? new Date(req.query.before) : null;

        const filter = { room };
        if (before) filter.createdAt = { $lt: before };

        const docs = await Message.find(filter).sort({ createdAt: -1 }).limit(limit).exec();
        res.json(docs.reverse());

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao buscar mensagens" });
    }
});

// POST - salvar e criar uma mensagem via REST
router.post("/", async (req, res) => {
    try {
        const { user, text, room = "global" } = req.body;
        if (!user || !text) return res.status(400).json({ error: "user e text obrigatórios" });

        const message = new Message({ user, text, room });
        await message.save();
        res.status(201).json(message);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao salvar mensagem" });
    }
});

export default router;
