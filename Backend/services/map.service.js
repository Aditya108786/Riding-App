 const axios = require('axios')
const captainModel = require('../models/captain.model')
module.exports.addresscoordinate = async(address)=>{
        
   const response = await axios.get("https://api.openrouteservice.org/geocode/autocomplete" , {
         params:{
            api_key:"eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjU3YjZhN2ZmNTk2MDQwYmQ5MWM4NDVjNjhlZDliM2JjIiwiaCI6Im11cm11cjY0In0=",
            text:address.trim(),
            "boundary.country": "IN",
         }
   })

   console.log(response.data)
   return response.data

}

module.exports.getdistancetime = async(origin , destination)=>{
          console.log(origin, destination)
    const apikey = process.env.API_KEY
   

    const body = {
        coordinates:[
           origin,
           destination
        ]
    }
       
    
           
      const response = await axios.post("https://api.openrouteservice.org/v2/directions/driving-car" , 

        body,
        {
            headers:{
                Authorization:apikey,
                "Content_type":"application/json"
            }
        }

            
      )

      return response.data

}


module.exports.getsuggestions = async(address)=>{
    const apikey = process.env.API_KEY
          
    const res = await axios.get("https://api.openrouteservice.org/geocode/autocomplete" ,
         {
            params:{
                api_key:apikey,
                text: address.trim(),
            "boundary.country": "IN",
            }
         }
    )
    console.log(res.data)
}

module.exports.getCaptaininTheRadius = async(ltd,lng, radius)=>{
           console.log("radius",ltd , lng,radius)
    const captains = await captainModel.find({
        location:{
            $geoWithin:{
                $centerSphere:[[ltd,lng], radius/6371]
            }
        }
       
    })
    console.log(captains)

    return captains
       
}

module.exports.coordinatesToAddress = async (lat,lng) => {

      
       console.log("latlngbody" , lat , lng)
    try {
        const apiKey = process.env.API_KEY;
              console.log("latlng" , lat , lng)
        const response = await axios.get(
            "https://api.openrouteservice.org/geocode/reverse",
            {
                params: {
                    api_key: apiKey,
                    "point.lat": lat,
                    "point.lon": lng,
                },
            }
        );

        return response.data.features[0].properties.label; // Full address
    } catch (error) {
        console.error("Reverse geocode error:", error.response?.data || error);
        return null;
    }
};
