import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { UserContext } from './context/usercontext.jsx'
import {CaptainContext} from './context/captaincontext.jsx'

import './index.css'
import App from './App.jsx'
import { SocketProvider } from './context/socketcontext.jsx'
import { Contextprovider } from './context/Ridingcontext.jsx'
import { ToastProvider } from './Components/Toast.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProvider>
     <Contextprovider>
    <SocketProvider>
    <CaptainContext>
    <UserContext>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    </UserContext>
    </CaptainContext>
    </SocketProvider>
    </Contextprovider>
    </ToastProvider>
    
  </StrictMode>
)
