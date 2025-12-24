import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CaptaindataContext } from '../context/captaincontext'
import axios from 'axios'
import { ArrowLeft, User, Mail, Lock, Phone, Car, Hash, Users, ChevronDown } from 'lucide-react'

const CaptainSignup = () => {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [vehicleColor, setVehicleColor] = useState('')
  const [vehiclePlate, setVehiclePlate] = useState('')
  const [vehicleCapacity, setVehicleCapacity] = useState('')
  const [vehicleType, setVehicleType] = useState('')

  const { setcaptaindata } = React.useContext(CaptaindataContext)

  const submitHandler = async (e) => {
    e.preventDefault()
    const captainData = {
      fullname: { firstname: firstName, lastname: lastName },
      email: email,
      password: password,
      phone: phone,
      vehicle: {
        color: vehicleColor,
        plate: vehiclePlate,
        capacity: vehicleCapacity,
        vehicleType: vehicleType
      }
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/register`, captainData)
      if (response.status === 201) {
        setcaptaindata(response.data.captain)
        localStorage.setItem('token', response.data.token)
        navigate('/captain-home')
      }
    } catch (err) {
      console.error("Signup failed", err)
    }
  }

  return (
    <div className='min-h-screen bg-white flex flex-col'>
      {/* Top Header */}
      <div className='p-6 flex items-center justify-between'>
        <button onClick={() => navigate(-1)} className='p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors'>
          <ArrowLeft size={24} />
        </button>
        
        <div className='w-10'></div> {/* Spacer for alignment */}
      </div>

      <div className='flex-1 px-6 pb-8'>
        <header className='mb-8'>
          <h1 className='text-3xl font-bold text-slate-900'>Join as Captain</h1>
          <p className='text-slate-500 mt-1'>Fill in your details to start earning.</p>
        </header>

        <form onSubmit={submitHandler} className='space-y-6'>
          {/* Section: Personal Info */}
          <div className='space-y-4'>
            <div className='flex items-center gap-2 mb-2'>
              <User size={18} className='text-blue-600' />
              <h3 className='font-bold text-slate-700 uppercase tracking-wider text-xs'>Personal Details</h3>
            </div>
            
            <div className='flex gap-3'>
              <input required className='bg-slate-100 w-1/2 rounded-xl px-4 py-3 border-transparent focus:border-blue-500 focus:bg-white transition-all outline-none' 
                type="text" placeholder='First name' value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              <input required className='bg-slate-100 w-1/2 rounded-xl px-4 py-3 border-transparent focus:border-blue-500 focus:bg-white transition-all outline-none' 
                type="text" placeholder='Last name' value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>

            <div className='relative'>
              <Mail className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400' size={18} />
              <input required className='bg-slate-100 w-full rounded-xl pl-12 pr-4 py-3 border-transparent focus:border-blue-500 focus:bg-white transition-all outline-none' 
                type="email" placeholder='Email address' value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className='relative'>
              <Phone className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400' size={18} />
              <input required className='bg-slate-100 w-full rounded-xl pl-12 pr-4 py-3 border-transparent focus:border-blue-500 focus:bg-white transition-all outline-none' 
                type="tel" placeholder='Phone number' value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>

            <div className='relative'>
              <Lock className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400' size={18} />
              <input required className='bg-slate-100 w-full rounded-xl pl-12 pr-4 py-3 border-transparent focus:border-blue-500 focus:bg-white transition-all outline-none' 
                type="password" placeholder='Create password' value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </div>

          {/* Section: Vehicle Info */}
          <div className='space-y-4 pt-4 border-t border-slate-100'>
            <div className='flex items-center gap-2 mb-2'>
              <Car size={18} className='text-blue-600' />
              <h3 className='font-bold text-slate-700 uppercase tracking-wider text-xs'>Vehicle Details</h3>
            </div>

            <div className='flex gap-3'>
              <input required className='bg-slate-100 w-1/2 rounded-xl px-4 py-3 border-transparent focus:border-blue-500 focus:bg-white transition-all outline-none' 
                type="text" placeholder='Color' value={vehicleColor} onChange={(e) => setVehicleColor(e.target.value)} />
              <input required className='bg-slate-100 w-1/2 rounded-xl px-4 py-3 border-transparent focus:border-blue-500 focus:bg-white transition-all outline-none' 
                type="text" placeholder='Plate Number' value={vehiclePlate} onChange={(e) => setVehiclePlate(e.target.value)} />
            </div>

            <div className='flex gap-3'>
              <div className='relative w-1/2'>
                <Users className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400' size={18} />
                <input required className='bg-slate-100 w-full rounded-xl pl-12 pr-4 py-3 border-transparent focus:border-blue-500 focus:bg-white transition-all outline-none' 
                  type="number" placeholder='Capacity' value={vehicleCapacity} onChange={(e) => setVehicleCapacity(e.target.value)} />
              </div>
              
              <div className='relative w-1/2'>
                <select required className='bg-slate-100 w-full rounded-xl px-4 py-3 border-transparent focus:border-blue-500 focus:bg-white transition-all outline-none appearance-none' 
                  value={vehicleType} onChange={(e) => setVehicleType(e.target.value)}>
                  <option value="" disabled>Type</option>
                  <option value="car">Car</option>
                  <option value="bike">Bike</option>
                  <option value="auto">Auto</option>
                </select>
                <ChevronDown className='absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none' size={18} />
              </div>
            </div>
          </div>

          <button className='bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl w-full shadow-lg shadow-blue-200 transition-all active:scale-[0.98] mt-4'>
            Create Account
          </button>
        </form>

        <p className='text-center mt-8 text-slate-600 font-medium'>
          Already have an account? <Link to='/Captainlogin' className='text-blue-600 font-bold'>Login</Link>
        </p>

        <p className='text-[11px] mt-10 text-slate-400 leading-tight text-center'>
          This site is protected by reCAPTCHA and the <span className='underline'>Google Privacy Policy</span> and <span className='underline'>Terms of Service</span> apply.
        </p>
      </div>
    </div>
  )
}

export default CaptainSignup