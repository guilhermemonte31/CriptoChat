import React from 'react'
import './Message.css'

const Message = ({ message, isOwn }) => {

  const time = message.timestamp
    ? new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "";

  return (
    <div className={`message-wrapper ${isOwn ? 'message-own' : ''}`}>
      <div className="message-content">
        <span className="message-info">
          <strong>{message.user}</strong> • {time}
        </span>
        <div className={`message-bubble ${isOwn ? 'message-bubble-own' : ''}`}>
          {message.text}
        </div>
      </div>
    </div>
  )
}

export default Message