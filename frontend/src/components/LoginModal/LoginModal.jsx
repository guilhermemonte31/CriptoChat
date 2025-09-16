import React, { useState } from 'react'
import './LoginModal.css'

const LoginModal = ({ onLogin }) => {
    const [inputName, setInputName] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()

        onLogin(inputName)
    }
  return (
      <div className='login-modal-overlay'>
          <div className="login-modal">
              <h2>CriptoChat</h2>
              <p>Digite seu nome para entrar no chat</p>

              <form onSubmit={handleSubmit}>
                  <input type="text" placeholder='Nome...' value={inputName} onChange={(e) => setInputName(e.target.value)} autoFocus />
                  {error && <span className='error'>{error}</span>}
                  <button type='submit'>Entrar no Chat</button>
              </form>
          </div>
    </div>
  )
}

export default LoginModal