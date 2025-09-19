import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "./App.css";
import Header from "./components/Header/Header";
import MessageList from "./components/MessageList/MessageList";
import ChatInput from "./components/ChatInput/ChatInput";
import Sidebar from "./components/Sidebar/Sidebar";
import LoginModal from "./components/LoginModal/LoginModal";

const socket = io("http://localhost:3001");

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [username, setUsername] = useState("");
  const [isTyping, setIsTyping] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState([username])

  useEffect(() => {
    socket.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  const handleLogin = (name, publicKeyPem) => {
    setUsername(name)
    socket.emit("user_join", name);
    socket.emit("public_key", {username: name, publicKey: publicKeyPem});
  }

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

  if (!username) {
    return <LoginModal onLogin={handleLogin} />
  }

  return (
    <div className="app-layout">
       <div className="app-container">
          <Header username={username} />
          <MessageList messages={messages} username={username} />
          <ChatInput
            input={input}
            setInput={setInput}
            handleSend={handleSend}
            isTyping={isTyping}
          />
      </div>
      <Sidebar
        username={username}
        onlineUsers={onlineUsers}
        messages={messages}
      />
    </div>
  );
}

export default App;
