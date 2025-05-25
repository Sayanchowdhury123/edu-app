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
import Sessionlesson from './pages/sessionslesson'
import Editsection from './pages/editsections'
import Editlesson from './pages/editlesson'
import Homepage from './pages/homepage'
import Course from './pages/Course'
import Editreview from './pages/Editreview'
import Videoplayer from './pages/videoplayer'


function App() {
 

  return (
    <>
    <Router>
      <Routes>
        <Route path='/signup' element={<Signup/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/home' element={<Homepage/>} />
        <Route path='/profile' element={<Privateroute><Profile/></Privateroute>}  />
        <Route path='/instructor-dasshboard' element={<Privateroute><Instructordashboard/></Privateroute>}  />
        <Route path='/create-course' element={<Privateroute><Createcourse/></Privateroute>}  />
        <Route path='/course-management' element={<Privateroute><Cousremanagementpage/></Privateroute>} />
        <Route  path='/instructor/edit-course/:courseid' element={<Privateroute><Editcourse/></Privateroute>} />
        <Route  path='/session-lesson/:courseid' element={<Privateroute><Sessionlesson/></Privateroute>} />
        <Route path='/edit-section/:courseid/:sectionindex' element={<Privateroute><Editsection/></Privateroute>} />
        <Route path='/edit-lesson/:courseid/:sectionindex/:lessonid' element={<Privateroute><Editlesson/></Privateroute>} />
        <Route path='/course/:courseid'  element={<Privateroute><Course/></Privateroute>} />
        <Route path='/reviews/:reviewid/:courseid' element={<Privateroute><Editreview/></Privateroute>} />
        <Route path='/video/:id' element={<Privateroute><Videoplayer/></Privateroute>} />
      </Routes>
    </Router>
    
    </>
  )
}

export default App
