import React from 'react'
import './Sidebar.css'

const Sidebar = ({ username, onlineUsers, messages }) => {
  return (
      <div className='sidebar'>
          <div className="sidebar-section">
              <h2>Seu Perfil</h2>
              <div className="profile-info">
                  <div className="avatar">
                      {username[0]}
                  </div>
                  <span>{username}</span>
              </div>
          </div>

          <div className="sidebar-section">
              <h2>Estatísticas</h2>
              <ul className="stats-list">
                  <li>
                      <span>Mensagens Enviadas</span>
                      <span>{messages.filter(m => m.from === username).length}</span>
                  </li>
                  <li>
                      <span>Total de Mensagens</span>
                      <span>{messages.length}</span>
                  </li>
              </ul>
          </div>

          <div className="sidebar-section">
              <h2>Usuários Online</h2>
              <div className="online-users">
                  {onlineUsers?.map(user => (
                      <div className="online-user" key={user}>
                          <span className="online-indicator"></span>
                          <span>{user}</span>
                      </div>
                  ))}
              </div>
          </div>
    </div>
  )
}

export default Sidebar