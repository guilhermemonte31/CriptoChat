import React from 'react'
import './Header.css'

const Header = ({ username }) => {
  return (
      <header className='header'>
          <div className="header-content">
              <h1>CriptoChat</h1>
              <span className='online-badge'>
                  Online: {username}
              </span>
          </div>
          <div className="time-display">
              {new Date().toLocaleTimeString()}
          </div>
    </header>
  )
}

export default Header