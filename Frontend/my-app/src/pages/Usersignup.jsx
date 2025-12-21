import React, { useState } from 'react'
import { useContext } from 'react'
import { UserdataContext } from '../context/usercontext.jsx'
import axios from 'axios'
import {Link, useNavigate} from 'react-router-dom'





 const Usersignup =()=>{
    const [firstname, setFirstname] = useState("");
    const [Lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const {user, setuserdata} = useContext(UserdataContext)
    const navigate = useNavigate();

    

  const handlesubmit=(e)=>{
    
    e.preventDefault();
     
    const newuser ={
        fullname:{
            firstname:firstname,
            Lastname:Lastname
        },
        email:email,
        password:password
    }

   

   const registeruser = async()=>{
      const res = await axios.post('http://localhost:4000/user/register', newuser)
        console.log(res.data);
        if(res.status === 201){
            const {user,token} = res.data
            setuserdata(user)
          
          localStorage.setItem('token', token)
            navigate('/')
        }

        setEmail(" ")
        setPassword(" ")
           setFirstname(" ")
              setLastname(" ")

  }
    registeruser();
  }

    return (
    <div>
      <div className='p-7 h-screen flex flex-col justify-between'>
        <div>
          <img className='w-16 mb-10' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYQy-OIkA6In0fTvVwZADPmFFibjmszu2A0g&s" alt="" />

          <form onSubmit={(e) => {
            handlesubmit(e)
          }}>

            <h3 className='text-lg w-1/2  font-medium mb-2'>What's your name</h3>
            <div className='flex gap-4 mb-7'>
              <input
                required
                className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border  text-lg placeholder:text-base'
                type="text"
                placeholder='First name'
                value={firstname}
                onChange={(e) => {
                  setFirstname(e.target.value)
                }}
              />
              <input
                required
                className='bg-[#eeeeee] w-1/2  rounded-lg px-4 py-2 border  text-lg placeholder:text-base'
                type="text"
                placeholder='Last name'
                value={Lastname}
                onChange={(e) => {
                  setLastname(e.target.value)
                }}
              />
            </div>

            <h3 className='text-lg font-medium mb-2'>What's your email</h3>
            <input
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
              }}
              className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
              type="email"
              placeholder='email@example.com'
            />

            <h3 className='text-lg font-medium mb-2'>Enter Password</h3>

            <input
              className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
              }}
              required type="password"
              placeholder='password'
            />

            <button
              className='bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base'
            >Create account</button>

          </form>
          <p className='text-center'>Already have a account? <Link to='/login' className='text-blue-600'>Login here</Link></p>
        </div>
        <div>
          <p className='text-[10px] leading-tight'>This site is protected by reCAPTCHA and the <span className='underline'>Google Privacy
            Policy</span> and <span className='underline'>Terms of Service apply</span>.</p>
        </div>
      </div>
    </div >
  )
}

export default Usersignup