import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router , Routes,Route } from 'react-router-dom'
import Signup from './pages/auth/signup'
import Login from './pages/auth/login'
import Privateroute from './pages/Privateroute'
import Profile from './pages/Profile'


function App() {
 

  return (
    <>
    <Router>
      <Routes>
        <Route path='/signup' element={<Signup/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/profile' element={<Privateroute><Profile/></Privateroute>}  />
      </Routes>
    </Router>
    
    </>
  )
}

export default App
