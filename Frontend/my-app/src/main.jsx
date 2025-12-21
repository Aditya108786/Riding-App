import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { UserContext } from './context/usercontext.jsx'
import {CaptainContext} from './context/captaincontext.jsx'

import './index.css'
import App from './App.jsx'
import { SocketContext, SocketProvider } from './context/socketcontext.jsx'
import { Contextprovider } from './context/Ridingcontext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
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
    
  </StrictMode>
)
