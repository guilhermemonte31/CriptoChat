import React from 'react'
import Message from '../Message/Message'
import './MessageList.css'

const MessageList = ({ messages, username, typingUsers }) => {
  return (
    <div className='message-container'>
      <div className="message-list">
        {messages.map((msg) => (
          <Message key={msg.id} message={msg} isOwn={msg.user === username} />
        ))}
      </div>

      {typingUsers && typingUsers.length > 0 && (
        <div className="typing-indicator">
          {typingUsers.join(", ")} {typingUsers.length === 1 ? "está" : "estão"} digitando...
        </div>
      )}
    </div>
  )
}

export default MessageList