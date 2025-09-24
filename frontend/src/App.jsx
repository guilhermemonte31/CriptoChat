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
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);

  useEffect(() => {
    socket.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("users_update", (users) => {
      setOnlineUsers(users);
    });

    socket.on("user_joined", (name) => {
      console.log(`${name} entrou no chat`);
    });

    socket.on("user_left", (name) => {
      console.log(`${name} saiu do chat`);
    });

    socket.on("user_typing", ({ username: user, isTyping }) => {
      setTypingUsers((prev) => {
        if (isTyping) {
          return prev.includes(user) ? prev : [...prev, user];
        } else {
          return prev.filter((u) => u !== user);
        }
      });
    });

    return () => {
      socket.off("receive_message");
      socket.off("users_update");
      socket.off("user_joined");
      socket.off("user_left");
      socket.off("user_typing");
    };
  }, []);

  const handleLogin = (name) => {
    setUsername(name)
    socket.emit("user_join", name)
  }

  const handleSend = () => {
    if (input.trim() === "") return;

    const newMsg = {
      user: username,
      text: input,
      id: crypto.randomUUID(),
    };

    socket.emit("send_message", newMsg);
    setInput("");
    setIsTyping(false);
  };

  useEffect(() => {
    if (username) {
      socket.emit("typing", isTyping);
    }
  }, [isTyping, username]);

  if (!username) {
    return <LoginModal onLogin={handleLogin} />
  }

  return (
    <div className="app-layout">
      <div className="app-container">
        <Header username={username} />
        <MessageList messages={messages} typingUsers={typingUsers} />
        <ChatInput
          input={input}
          setInput={setInput}
          handleSend={handleSend}
          setIsTyping={setIsTyping}
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
