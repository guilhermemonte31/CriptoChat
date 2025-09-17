import React from 'react'
import Message from '../Message/Message'
import './MessageList.css'

const MessageList = ({ messages, username }) => {
  return (
    <div className='message-container'>
      <div className="message-list">
        {messages.map((msg) => {
          const isOwn = msg.from?.trim().toLowerCase() === username?.trim().toLowerCase()
          console.log("msg.from:", msg.from, "| username:", username, "| isOwn:", isOwn)

          return (
            <Message 
              key={msg.id} 
              message={msg} 
              isOwn={isOwn}
              className={isOwn ? 'own-message' : 'other-message'}
            />
          )
        })}
      </div>
    </div>
  )
}

export default MessageList
