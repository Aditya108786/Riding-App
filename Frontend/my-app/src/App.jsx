import './index.css'
import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'

const Home = lazy(() => import('./pages/Home.jsx'))
const Userlogin = lazy(() => import('./pages/Userlogin.jsx'))
const Usersignup = lazy(() => import('./pages/Usersignup.jsx'))
const Captainlogin = lazy(() => import('./pages/Captainlogin.jsx'))
const CaptainSignup = lazy(() => import('./pages/CaptainSignup.jsx'))
const UserProtectedRoute = lazy(() => import('./pages/UserprotectedRoute.jsx'))
const Logoutuser = lazy(() => import('./pages/Logoutuser.jsx').then((m) => ({ default: m.Logoutuser })))
const CaptainProtectedRoute = lazy(() => import('./pages/CaptainProtectedRoute.jsx'))
const CaptainHome = lazy(() => import('./pages/CaptainHome.jsx'))
const Captainlogout = lazy(() => import('./pages/Captainlogout.jsx').then((m) => ({ default: m.Captainlogout })))
const Userhome = lazy(() => import('./pages/Userhome.jsx'))
const Riding = lazy(() => import('./pages/Riding.jsx').then((m) => ({ default: m.Riding })))
const Captainriding = lazy(() => import('./pages/Captainriding.jsx'))
const Ridinguser = lazy(() => import('./pages/Ridinguser.jsx').then((m) => ({ default: m.Ridinguser })))
const NotFound = lazy(() => import('./pages/NotFound.jsx'))

const RouteLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="flex items-center gap-2 text-slate-600 font-medium">
      <i className="ri-loader-4-line animate-spin"></i>
      Loading...
    </div>
  </div>
)
function App() {
  

  return (
    <Suspense fallback={<RouteLoader />}>
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
        <Route path='riding' element={<Riding/>} />
        <Route path='Captain-riding' element={<Captainriding/>} />

        <Route  path='/user-riding' element={<UserProtectedRoute>
          <Ridinguser/>
        </UserProtectedRoute>}/>
        <Route path='*' element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

export default App
