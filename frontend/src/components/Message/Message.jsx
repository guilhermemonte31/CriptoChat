import React from 'react'
import './Message.css'

const Message = ({ message, isOwn, className }) => {
  return (
    <div className={`message-wrapper ${className}`}>
      <div className={`message ${isOwn ? 'message-own' : 'message-other'}`}>
        <div className="message-info">
          <span className="message-sender">{message.from}</span>
          <span className="message-time">
            {new Date(message.id).toLocaleTimeString()}
          </span>
        </div>
        <div className="message-content">
          {message.text}
        </div>
      </div>
    </div>
  )
}

export default Message