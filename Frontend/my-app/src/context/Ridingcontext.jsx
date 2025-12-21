import { createContext,useEffect, useState } from "react";


export const Ridingcontext = createContext()


export const Contextprovider = ({children})=>{
      const [ridingdata , setridingdata] = useState()

         console.log(ridingdata)

      return(
         <Ridingcontext.Provider value={{ridingdata , setridingdata}}>
            {children}
         </Ridingcontext.Provider>
      )
}