const mapservice = require('../services/map.service')




module.exports.getcoordinate = async(req,res)=>{
      const {address} = req.query
      if(!address){
        return res.status(400).json({message:"address required"})
      }
       
      try {
         const coordinates = await mapservice.addresscoordinate(address)
         console.log(coordinates.features)
         if(!coordinates){
            return res.status(404).json({message:"coordinates not found"})
         }
          res.status(200).json(coordinates.features)
      } catch (error) {
         console.error(error.message)
      }
}


module.exports.getdistancetime = async(req,res)=>{
             const {arrpickup, arrdestination} = req.body
            
            console.log(arrpickup, arrdestination)
             if(!arrpickup && !arrdestination){
                return res.json({message:"pickup and destination required"})
             }

             try {
                 const response = await mapservice.getdistancetime(arrpickup, arrdestination) 
                  console.log(response.routes[0].summary)
                  res.status(200).json(response.routes)
             } catch (error) {
                console.error(error.message)
             }
}

module.exports.getsuggestions = async(req,res)=>{
             
}

module.exports.getfulladdress = async(req,res)=>{
      const {lat , lng} = req.body     
      if(!lat || !lng){

         return res.status(400).json({message:"latitude and longitude required"})
      }
      try {
          const address = await mapservice.coordinatesToAddress(lat , lng)
          res.status(200).json({address:address})
      } catch (error) {
         console.error(error.message)
      }
}