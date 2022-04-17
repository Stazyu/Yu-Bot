import './App.css';
import React, { useEffect, useState } from 'react';
import socket from './components/SocketIO';

import checked from './assets/image/checked.png';
import process from './assets/image/process.png';
import Button from './components/Button/Button';

function App() {
  const [qrCode, setQrCode] = useState(null);
  const [waConnect, setWaConnect] = useState(false);
  socket.on('bot:qr', (qr) => {
    setQrCode(qr);
  });
  socket.on('bot:connect', (conn) => {
    setWaConnect(conn);
  })

  if (waConnect === true) {
    localStorage.setItem('waConnect', true);
    localStorage.setItem('qr', ' ');
  } else if (qrCode !== null) {
    localStorage.setItem('qr', qrCode);
    localStorage.setItem('waConnect', false);
  }

  const showWaConnect = window.localStorage.getItem('waConnect');
  const showQrCode = window.localStorage.getItem('qr');

  return (
    <>
      <div className="App">
        <header className="App-header">
          {String(showQrCode).includes('base64') ?
            <img src={showQrCode} className="App-logo" alt="Qr Code Whatsapp" />
            : showWaConnect !== 'false' && showWaConnect !== null ?
              <img src={checked} className='App-logo' alt='Checked' />
              :
              <img src={process} className='App-logo' alt='Process' />
          }
          {console.log(showQrCode)}
          {String(showQrCode).includes('base64') ?
            <h2>Silahkan Scan QR Code di atas ini!</h2>
            : showWaConnect !== 'false' && showWaConnect !== null ?
              <h2>Sukses Login ke Whatsapp</h2>
              :
              <h2>Qr Code sedang dalam proses..</h2>
          }
          <a
            className="App-link"
            href=""
            target="_blank"
            rel="noopener noreferrer"
          >
            Whatsapp Bot
          </a>
          <Button />
        </header>
      </div>
    </>
  );
}

export default App;
