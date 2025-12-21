import axios from "axios"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export const Logoutuser =  ()=>{
  const navigate = useNavigate()
    useEffect(()=>{
         const userlogout = async()=>{
              const res =   await axios.post("http://localhost:4000/user/logout" ,{}, {withCredentials:true})
    
    if(res.status === 200){
        localStorage.removeItem('token')
        navigate('/Userlogin')
    }else{
         
         console.log("logout failed")
    }
         }

         userlogout()
    },[])
        
    

    return (
        <div>
            user logout
        </div>
    )
   

}