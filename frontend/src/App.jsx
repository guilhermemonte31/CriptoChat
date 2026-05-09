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
  const [privateKey, setPrivateKey] = useState(null);

  // useEffect(() => {
  //   //é pra receber msg criptografada aqui
  //   socket.on("receive_message", (msg) => {
  //     setMessages((prev) => [...prev, msg]);
  //   });

  //   return () => {
  //     socket.off("receive_message");
  //   };
  // }, []);
  async function decryptMessage(privateKey, encryptedBase64) {
  const encrypted = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0));
  const decrypted = await window.crypto.subtle.decrypt(
    { name: "RSA-OAEP" },
    privateKey,
    encrypted
  );
  return new TextDecoder().decode(decrypted);
}

  useEffect(() => {
  socket.on("receive_encrypted_message", async ({ from, encryptedMessage }) => {
    if (!privateKey) return;
    const decrypted = await decryptMessage(privateKey, encryptedMessage);
    setMessages((prev) => [...prev, { from, text: decrypted }]);
  });

  return () => {
    socket.off("receive_encrypted_message");
  };
}, [privateKey]);



  const handleSend = () => {
    if (input.trim() === "") return;
    //tratar o input para enviar criptografdo com a public key do destinatario

    const newMsg = {
      id: Date.now(),
      from: username,
      text: input,
    };

    setMessages((prev) => [...prev, newMsg]);
    //enviar a versao criptografada
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
