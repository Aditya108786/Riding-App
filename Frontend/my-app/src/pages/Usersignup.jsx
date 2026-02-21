import React, { useState, useContext } from 'react'
import { UserdataContext } from '../context/usercontext.jsx'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Phone, Mail, Lock, ChevronRight, Eye, EyeOff } from 'lucide-react'

const Usersignup = () => {
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const { setuserdata } = useContext(UserdataContext)
    const navigate = useNavigate();

    const handlesubmit = async (e) => {
        e.preventDefault();
        setError("");

        const newuser = {
            fullname: {
                firstname: firstname.trim(),
                lastname: lastname.trim()
            },
            email: email.trim(),
            phone: phone.trim(),
            password: password
        }

        setIsSubmitting(true);
        try {
            const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/register`, newuser)
            if (res.status === 201) {
                const { user } = res.data
                setuserdata(user)
                setEmail("")
                setPassword("")
                setPhone("")
                setFirstname("")
                setLastname("")
                navigate('/Userhome')
            }
        } catch (err) {
            console.error("Registration failed", err)
            setError(err?.response?.data?.message || err?.response?.data?.errors?.[0]?.msg || "Registration failed. Please check your details.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className='min-h-screen bg-gradient-to-b from-white to-slate-50 flex flex-col font-sans'>
            {/* Top Navigation */}
            <div className='p-6 flex items-center justify-between'>
                <button onClick={() => navigate(-1)} className='p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors'>
                    <ArrowLeft size={24} className='text-slate-900' />
                </button>
                
                
            </div>

            <div className='flex-1 px-5 sm:px-8 pt-4 pb-10 flex flex-col justify-between'>
                <div className='w-full max-w-md mx-auto'>
                    <header className='mb-10'>
                        <h1 className='text-3xl font-bold text-slate-900'>Create Account</h1>
                        <p className='text-slate-500 mt-2 font-medium'>Sign up to start your journey with us.</p>
                    </header>

                    <form onSubmit={handlesubmit} className='space-y-5'>
                        {/* Name Inputs */}
                        <div className='flex gap-4'>
                            <div className='w-1/2 space-y-2'>
                                <label className='text-xs font-bold text-slate-400 uppercase ml-1'>First Name</label>
                                <input
                                    required
                                    className='bg-slate-100 w-full rounded-2xl px-4 py-4 border-2 border-transparent focus:border-black focus:bg-white transition-all outline-none font-medium'
                                    type="text"
                                    placeholder='e.g. John'
                                    value={firstname}
                                    onChange={(e) => setFirstname(e.target.value)}
                                />
                            </div>
                            <div className='w-1/2 space-y-2'>
                                <label className='text-xs font-bold text-slate-400 uppercase ml-1'>Last Name</label>
                                <input
                                    required
                                    className='bg-slate-100 w-full rounded-2xl px-4 py-4 border-2 border-transparent focus:border-black focus:bg-white transition-all outline-none font-medium'
                                    type="text"
                                    placeholder='e.g. Doe'
                                    value={lastname}
                                    onChange={(e) => setLastname(e.target.value)}
                                />
                            </div>
                        </div>

                         <div className='space-y-2'>
                            <label className='text-xs font-bold text-slate-400 uppercase ml-1'>Phone</label>
                            <div className='relative'>
                                
                                <Phone className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400' size={20} />
                                <input
                                    required
                                    className='bg-slate-100 w-full rounded-2xl pl-12 pr-4 py-4 border-2 border-transparent focus:border-black focus:bg-white transition-all outline-none font-medium'
                                    type="tel"
                                    placeholder='910xxxxxxx'
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Email Input */}
                        <div className='space-y-2'>
                            <label className='text-xs font-bold text-slate-400 uppercase ml-1'>Email Address</label>
                            <div className='relative'>
                                <Mail className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400' size={20} />
                                <input
                                    required
                                    className='bg-slate-100 w-full rounded-2xl pl-12 pr-4 py-4 border-2 border-transparent focus:border-black focus:bg-white transition-all outline-none font-medium'
                                    type="email"
                                    placeholder='name@example.com'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className='space-y-2'>
                            <label className='text-xs font-bold text-slate-400 uppercase ml-1'>Password</label>
                            <div className='relative'>
                                <Lock className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400' size={20} />
                                <input
                                    required
                                    className='bg-slate-100 w-full rounded-2xl pl-12 pr-12 py-4 border-2 border-transparent focus:border-black focus:bg-white transition-all outline-none font-medium'
                                    type={showPassword ? "text" : "password"}
                                    placeholder='Minimum 6 characters'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className='absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-500 hover:text-slate-700'
                                    onClick={() => setShowPassword((prev) => !prev)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <p className='text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-xl'>
                                {error}
                            </p>
                        )}

                        <button
                            disabled={isSubmitting}
                            className='bg-black disabled:bg-slate-400 text-white font-bold mt-4 py-4 rounded-2xl w-full flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-xl shadow-slate-200'
                        >
                            {isSubmitting ? "Creating..." : "Create Account"}
                            <ChevronRight size={20} />
                        </button>
                    </form>

                    <p className='text-center mt-8 text-slate-600 font-medium'>
                        Already have an account? <Link to='/Userlogin' className='text-blue-600 font-bold'>Login</Link>
                    </p>
                </div>

                <div className='mt-auto max-w-md mx-auto w-full'>
                    <p className='text-[11px] leading-tight text-slate-400 text-center'>
                        By signing up, you agree to our <span className='underline'>Terms of Service</span> and <span className='underline'>Privacy Policy</span>. This site is protected by reCAPTCHA.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Usersignup
