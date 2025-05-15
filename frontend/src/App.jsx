import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router , Routes,Route } from 'react-router-dom'
import Signup from './pages/auth/signup'
import Login from './pages/auth/login'
import Privateroute from './pages/Privateroute'
import Profile from './pages/Profile'
import Instructordashboard from './pages/Instrucdashboard'
import Createcourse from './pages/createcourse'
import Cousremanagementpage from './pages/Coursemangement'
import Editcourse from './pages/Editcourse'


function App() {
 

  return (
    <>
    <Router>
      <Routes>
        <Route path='/signup' element={<Signup/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/profile' element={<Privateroute><Profile/></Privateroute>}  />
        <Route path='/instructor-dasshboard' element={<Privateroute><Instructordashboard/></Privateroute>}  />
        <Route path='/create-course' element={<Privateroute><Createcourse/></Privateroute>}  />
        <Route path='/course-management' element={<Privateroute><Cousremanagementpage/></Privateroute>} />
        <Route  path='/instructor/edit-course/:courseid' element={<Privateroute><Editcourse/></Privateroute>} />
      </Routes>
    </Router>
    
    </>
  )
}

export default App
