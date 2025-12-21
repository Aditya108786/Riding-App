import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Userlogin from './pages/Userlogin.jsx'
import Usersignup from './pages/Usersignup.jsx'
import Captainlogin from './pages/Captainlogin.jsx'
import CaptainSignup from './pages/CaptainSignup.jsx'
import UserProtectedRoute from './pages/UserprotectedRoute.jsx'
import { Logoutuser } from './pages/Logoutuser.jsx'
import CaptainProtectedRoute from './pages/CaptainProtectedRoute.jsx'
import CaptainHome from './pages/CaptainHome.jsx'
import { Captainlogout } from './pages/Captainlogout.jsx'
import Userhome from './pages/Userhome.jsx'
import {Riding} from './pages/Riding.jsx'
import Captainriding from './pages/Captainriding.jsx'
import { Ridinguser } from './pages/Ridinguser.jsx'
function App() {
  

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path='/Userlogin' element={<Userlogin/>}/>
      <Route path='/UserSignup' element={<Usersignup/>}/>
      <Route path = '/Captainlogin' element={<Captainlogin/>}/>
      <Route path = '/Captainsignup' element={<CaptainSignup/>}/>
      <Route path = '/Userlogout' element={<UserProtectedRoute>
         <Logoutuser/>
      </UserProtectedRoute>}/>
      <Route path = '/Captainlogout' element={<CaptainProtectedRoute>
         <Captainlogout/>
      </CaptainProtectedRoute>}/>

      <Route path="/Userhome" element={
        
        <UserProtectedRoute>
          <Userhome/>


        </UserProtectedRoute>
      } />

      <Route path = '/CaptainHome' element={<CaptainProtectedRoute>
        <CaptainHome/>
      </CaptainProtectedRoute>}/>
      <Route path='riding' 
         element={<Riding/>}
      />

      <Route path='Captain-riding' 
      
      element={<Captainriding/>}
      
      />

      <Route  path='/user-riding' element={<UserProtectedRoute>
         <Ridinguser/>
      </UserProtectedRoute>}/>
    </Routes>
  )
}

export default App
