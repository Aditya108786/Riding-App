import { useState } from "react"
import { useContext } from "react"
import { CaptaindataContext } from "../context/captaincontext.jsx"
import axios from "axios"
import { useNavigate } from "react-router-dom"


const Captainlogin =() =>{
      const [email,setemail] = useState("")
      const [password, setpassword]  = useState("")

      const {updatecaptain, isloading , setloading, error , seterror} = useContext(CaptaindataContext)
        const navigate = useNavigate()

      const submithandler = async(e)=>{
            e.preventDefault()
            setloading(true)
            seterror(null)

            const response = await axios.post("http://localhost:4000/captain/login", 
                 {
                    email,
                    password
                 },{
                    withCredentials:true
                 }
            )
            const data = response.data
            console.log(data)
            if(response.status === 200){
                updatecaptain({
                    ...data.captain

                })

                
                setloading(false)
                navigate('/CaptainHome')
            }else{
                seterror(data.message)
                setloading(false)
            }
      }



    return(
        <div>
            <h2 className="text-2xl font-bold mb-7">Login to your account</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={(e)=>{
                submithandler(e)
            }}>

                <h3 className="text-xl mb-2" > What's your email</h3>
                <input
                required
                className="mb-7 rounded px-4 py-2 border w-full text-lg placeholder:italic placeholder:text-slate-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                type="email"
                placeholder="email"
                value={email}
                onChange={(e)=>{setemail(e.target.value)}}
                />


              <input
                required
                type="password"
                className="mb-7 rounded px-4 py-2 border w-full text-lg placeholder:italic placeholder:text-slate-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                placeholder="password"
                value={password}
                onChange={(e)=>{setpassword(e.target.value)}}
              />
     <button type="submit"
              disabled={isloading}
              className="bg-black text-white w-full py-3 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >

                {isloading ? "Logging in ..." : "Login"}



            </button>
            </form>
            
        </div>
    )
}

export default Captainlogin