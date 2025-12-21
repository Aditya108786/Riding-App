import { createContext, useEffect } from "react";
import { useState } from "react";
import axios from "axios";
export const CaptaindataContext = createContext()



export const CaptainContext = ({children}) =>{
          const [captain, setcaptaindata] = useState(null)
          const [isloading , setloading] = useState(false)
          const [error , seterror] = useState(null)

          // New: hold the current active ride when captain starts a ride
          const [currentRide, setCurrentRide] = useState(null)

          const updatecaptain = (data)=>{
                
    

                   setcaptaindata(data)
          }

          useEffect(()=>{
               const fetchcaptain = async()=>{
                      const res = await axios.get("http://localhost:4000/captain/profile",{withCredentials:true})
                      console.log("context" , res.data)
                      if(res.status === 200){
                        setcaptaindata(res.data)
                      }
               }

               fetchcaptain()
          },[])
          console.log("cap" , captain)
          
          const value ={
            captain,
            isloading,
            error,
            seterror,
            updatecaptain,
            setcaptaindata,
            setloading,
            // Expose ride state
            currentRide,
            setCurrentRide,

          }
          console.log(value)

          return (
            <CaptaindataContext.Provider value={value}> 
               {children}
            </CaptaindataContext.Provider>
          )
}