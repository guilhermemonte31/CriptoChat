import React, { useEffect, useRef } from 'react';
import './ChatInput.css'

const ChatInput = ({ input, setInput, handleSend, setIsTyping }) => {

  const typingTimeoutRef = useRef(null);

  const handleChange = (e) => {
    setInput(e.target.value);

    setIsTyping(true);

    // Limpa timeout anterior
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
      setIsTyping(false);
    }
  };

  return (
    <div className='chat-input-container'>
      <div className="chat-input-wrapper">
        <input
          type="text"
          className='chat-input'
          placeholder='Digite sua mensagem...'
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <button className='send-button' onClick={() => { handleSend(); setIsTyping(false); }}>
          <span>Enviar</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="send-icon" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default ChatInput