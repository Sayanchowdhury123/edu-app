import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Authprovider } from './context/Authcontext.jsx'

createRoot(document.getElementById('root')).render(
  <Authprovider>
  <StrictMode>
    <App />
  </StrictMode>
  </Authprovider>

)
