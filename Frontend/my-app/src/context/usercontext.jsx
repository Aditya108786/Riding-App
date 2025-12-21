
import { useEffect } from "react";
import { useState , createContext } from "react";
import axios from "axios";
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
            const res = await axios.get("http://localhost:4000/user/profile" , {
                  withCredentials:true
            })
            console.log("usercontext",res.data)
            if(res.status == 200){
                setuserdata(res.data)
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

