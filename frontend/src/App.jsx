import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "./App.css";

const socket = io("http://localhost:3001");

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    
    const name = prompt("Digite seu nome:");
    setUsername(name || "Anonimo");

    socket.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  const handleSend = () => {
    if (input.trim() === "") return;

    const newMsg = {
      id: Date.now(),
      from: username,
      text: input,
    };

    setMessages((prev) => [...prev, newMsg]);
    socket.emit("send_message", newMsg);
    setInput("");
  };

  return (

    <div className="flex flex-col h-screen bg-gray-100 ">
      <header className="bg-blue-600 text-white p-4 text-lg font-semibold">
        Chat em tempo real
      </header>
      <title>Chat</title>
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex mb-2 ${
              msg.from === username ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-2xl max-w-xs break-words ${
                msg.from === username
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-gray-300 text-black rounded-bl-none"
              }`}
            >
              <strong>{msg.from}: </strong>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t bg-white flex">
        <input
          type="text"
          className="flex-1 border rounded-2xl px-4 py-2 mr-2 focus:outline-none focus:ring focus:ring-blue-300"
          placeholder="Digite sua mensagem..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-blue-700 text-white px-4 py-2 rounded-2xl hover:bg-blue-700"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}

export default App;
