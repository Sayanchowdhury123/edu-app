import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Authprovider } from './context/Authcontext.jsx'
import { Themeprovider } from './context/Themecontext.jsx'

createRoot(document.getElementById('root')).render(

  <StrictMode>
    <Themeprovider>
    <Authprovider>
      <App />
    </Authprovider>
    </Themeprovider>
  </StrictMode>

)
