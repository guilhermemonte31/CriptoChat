import React from 'react'
import Message from '../Message/Message'
import './MessageList.css'

const MessageList = ({ messages, username }) => {
  return (
      <div className='message-container'>
          <div className="message-list">
              {messages.map((msg) => (
                  <Message key={msg.id} message={msg} isOwn={msg.from === username} />
              ))}
          </div>
    </div>
  )
}

export default MessageList