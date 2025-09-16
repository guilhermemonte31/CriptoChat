import React from 'react'
import './Message.css'

const Message = ({ message, isOwn }) => {
  return (
      <div className={`message-wrapper ${isOwn ? 'message-own' : ''}`}>
          <div className="message-content">
              <span className="message-info">
                {message.from} • {new Date(message.id).toLocaleTimeString()}
              </span>
              <div className={`message-bubble ${isOwn ? 'message-bubble-own' : ''}`}>
                  {message.text}
              </div>
          </div>
    </div>
  )
}

export default Message