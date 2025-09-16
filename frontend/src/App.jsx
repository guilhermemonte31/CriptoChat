import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "./App.css";
import Header from "./components/Header/Header";
import Message from "./components/Message/Message";
import MessageList from "./components/MessageList/MessageList";
import ChatInput from "./components/ChatInput/ChatInput";

const socket = io("http://localhost:3001");

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [username, setUsername] = useState("");
  const [isTyping, setIsTyping] = useState(false)

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
    <div className="app-container">
      <Header username={username} />
      <MessageList messages={messages} />
      <ChatInput
        input={input}
        setInput={setInput}
        handleSend={handleSend}
        isTyping={isTyping}
      />
    </div>
    
  );
}

export default App;
