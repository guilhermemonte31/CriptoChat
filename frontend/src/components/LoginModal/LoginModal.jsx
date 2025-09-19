// import React, { useState } from 'react'
// import './LoginModal.css'


// const LoginModal = ({ onLogin }) => {
//     const [inputName, setInputName] = useState('')
//     const [error, setError] = useState('')

//     const handleSubmit = (e) => {
//         e.preventDefault()

//         onLogin(inputName)
//     }
//   return (
//       <div className='login-modal-overlay'>
//           <div className="login-modal">
//               <h2>CriptoChat</h2>
//               <p>Digite seu nome para entrar no chat</p>

//               <form onSubmit={handleSubmit}>
//                   <input type="text" placeholder='Nome...' value={inputName} onChange={(e) => setInputName(e.target.value)} autoFocus />
//                   {error && <span className='error'>{error}</span>}
//                   <button type='submit'>Entrar no Chat</button>
//               </form>
//           </div>
//     </div>
//   )
// }

// export default LoginModal

import React, { useState } from 'react'
import './LoginModal.css'


async function generateRSAKeyPair() {
    return await window.crypto.subtle.generateKey(
        {
            name: "RSA-OAEP",
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256",
        },
        true,
        ["encrypt", "decrypt"]
    );
}

async function exportPublicKey(key) {
    const spki = await window.crypto.subtle.exportKey("spki", key);
    const b64 = window.btoa(String.fromCharCode(...new Uint8Array(spki)));
    return `-----BEGIN PUBLIC KEY-----\n${b64.match(/.{1,64}/g).join('\n')}\n-----END PUBLIC KEY-----`;
}

const LoginModal = ({ onLogin }) => {
    const [inputName, setInputName] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!inputName) {
            setError('Digite um nome');
            return;
        }
        try {
            //Gera o par de chaves
            const keyPair = await generateRSAKeyPair();
            const publicKeyPem = await exportPublicKey(keyPair.publicKey);
            //chave privada deve ser guardada localmente (exemplo: window, context, etc)
            //window.myPrivateKey = keyPair.privateKey;
            localStorage.setItem('privateKey', JSON.stringify(keyPair.privateKey)); 
            console.log('Chave privada armazenada localmente');
            console.log('Chave pública:', publicKeyPem);
            
            
            onLogin(inputName, publicKeyPem, keyPair.privateKey);
        } catch (err) {
            setError('Erro ao gerar chaves');
        }
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