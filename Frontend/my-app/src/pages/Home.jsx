import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserdataContext } from '../context/usercontext';
import { CaptainContext } from '../context/captaincontext';
// Using standard icons that are guaranteed to be in the lucide-react library
import { Car, UserCircle, ChevronRight, MapPin } from 'lucide-react';

const Home = () => {
     const navigate = useNavigate()
     const {userdata} = useContext(UserdataContext)
    // const {captain} = useContext(CaptainContext)
    const Gotouser = ()=>{

         navigate('/Userlogin')
    }

    const Gotocaptain = ()=>{
        navigate('/captainlogin')
    }

    const RegisterCaptain = ()=>{
           navigate('/Captainsignup')
    }

    const RegisterPassenger = ()=>{
         navigate('/UserSignup')
    }

  return (
    <div className="h-screen bg-slate-950 flex flex-col font-sans overflow-hidden">
      
      {/* 1. Visual Header */}
      <div className="h-[35%] relative flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full"></div>
        
        <div className="z-10 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/10">
              <MapPin className="text-blue-500" size={32} />
            </div>
          </div>
          <div className="text-4xl font-black italic tracking-tighter text-white mb-1">
            RIDE<span className="text-blue-500">FLOW</span>
          </div>
          <p className="text-slate-400 text-[10px] tracking-[0.2em] uppercase font-bold">Premium Urban Mobility</p>
        </div>
      </div>

      {/* 2. Selection Area */}
      <div className="flex-1 bg-white rounded-t-[40px] p-8 flex flex-col justify-between shadow-2xl">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 leading-tight">
              Let's get moving
            </h1>
            <p className="text-slate-500 mt-2">Choose your account type to continue</p>
          </div>

          <div className="space-y-4">
            {/* User Option */}
            <button onClick={Gotouser} className="w-full group flex items-center justify-between p-5 bg-slate-50 rounded-3xl border-2 border-transparent active:border-blue-500 active:bg-blue-50 transition-all text-left">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                   <Car size={24} />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-lg">Passenger</p>
                  <p className="text-sm text-slate-500">I want to book a ride</p>
                </div>
              </div>
              <ChevronRight className="text-slate-300 group-active:text-blue-500" size={20} />
            </button>

            {/* Captain Option */}
            <button onClick={Gotocaptain} className="w-full group flex items-center justify-between p-5 bg-slate-50 rounded-3xl border-2 border-transparent active:border-emerald-500 active:bg-emerald-50 transition-all text-left">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                  <UserCircle size={24} />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-lg">Captain</p>
                  <p className="text-sm text-slate-500">I want to drive and earn</p>
                </div>
              </div>
              <ChevronRight className="text-slate-300 group-active:text-emerald-500" size={20} />
            </button>
          </div>
        </div>

        {/* 3. Bottom Actions */}
        <div className="flex flex-col items-center gap-4">
          <button  className="text-slate-500 font-medium text-sm">
            Don't have an account? <span className="text-blue-600 font-bold">Sign Up</span>
          </button>
          <button onClick={RegisterCaptain} className="text-slate-500 font-medium text-sm"><span className="text-blue-600 font-bold">Captain</span></button>
          <button onClick={RegisterPassenger} className="text-slate-500 font-medium text-sm"><span className="text-blue-600 font-bold">Passenger</span></button>
          {/* Simulated Home Bar for iOS/Android */}
          <div className="w-32 h-1.5 bg-slate-200 rounded-full mb-2"></div>
        </div>
      </div>
    </div>
  );
};

export default Home;