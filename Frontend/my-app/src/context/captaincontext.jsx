import { createContext, useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { buildServiceUrl } from "../lib/serviceUrl";
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
                      try {
                        const res = await axios.get(buildServiceUrl('/captain/profile'),{withCredentials:true})
                       
                        if(res.status === 200){
                          setcaptaindata(res.data)
                        }
                      } catch (err) {
                        // Ignore on public routes where captain is not logged in.
                      }
               }

               fetchcaptain()
          },[])
         
          
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
          

          return (
            <CaptaindataContext.Provider value={value}> 
               {children}
            </CaptaindataContext.Provider>
          )
}
