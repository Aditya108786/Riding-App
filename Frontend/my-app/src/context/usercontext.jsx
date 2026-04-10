
import { useEffect } from "react";
import { useState , createContext } from "react";
import axios from "axios";
import { buildServiceUrl } from "../lib/serviceUrl";
export const UserdataContext = createContext()



export const  UserContext = ({children}) =>{
      
    const [user , setuserdata] = useState({
         fullname:{
            Firstname:"",
            Lastname:" "
         },
         email:"",
         password:" "
    })

    const [error , seterror] = useState(null)
    const[isloading , setloading] = useState(false)

    const updateuser = (data)=>{
           setuserdata(data)
    }

  useEffect(()=>{
       const fetchuserdata = async()=>{
            try {
                const res = await axios.get(buildServiceUrl('/user/profile') , {
                      withCredentials:true
                })
                
                if(res.status === 200){
                    setuserdata(res.data)
                }
            } catch (err) {
                // Ignore on public routes where user is not logged in.
            }
       }
       fetchuserdata()
  },[])


    return(
        <UserdataContext.Provider value={{user,setuserdata ,updateuser, error, seterror, isloading, setloading}}>

                {children}
        </UserdataContext.Provider>
    )
}

