const rideservice  = require('../services/ride.services')
const mapservice = require('../services/map.service')
const ridemodel = require('../models/ride.model')
const {getIO , sendmessagetosocketid, getuserSocketId  , captainsockets} = require('../socket')


module.exports.createRide = async(req , res)=>{
     const { vehicleType, pickup , destination} = req.body
     
       

     try {
        const ride = await rideservice.createride({pickup , destination , user:req.user._id,vehicleType })
        console.log("rde" , pickup)
        
        //const coordinates = await mapservice.addresscoordinate(pickup)
          // console.log("PICKUP",coordinates)
           
           res.status(201).json(ride)
           

           const captains = await mapservice.getCaptaininTheRadius(pickup[1] , pickup[0] , 10)
           console.log("captains" , captains)
           ride.OTP = null
           const ridewithuser = await ridemodel.findOne({_id:ride._id}).populate('user' , '-password -resetpasswordtoken -resetpasswordexpire')
           // console.log("hrsd" , ridewithuser)
           const io = getIO()
           captains.forEach((captain)=>{
            
            console.log("hello bro",captain.socketId);
                  io.to(captain.socketId).emit("newride" , {
                     
                     message:'A new ride request',
                     ridewithuser
                  })
           })
           
     } catch (error) {
      console.error("error in creating ride" , error)
        return res.status(500).json({message:error.message})
     }
}



module.exports.getfare = async(req ,res)=>{
      const {pickup, destination , vehicleType} = req.body
             
      try {
          const fare = await rideservice.getprice({pickup, destination, vehicleType})
          
          return res.status(201).json(fare)
      } catch (error) {
         return res.status(500).json({message:error.message})
      }
}


module.exports.ConfirmRide = async(req,res)=>{
        const {rideId } = req.body
        const captain = req.captain
        
        const roomId = `chat_${rideId}`
       

        if(!rideId || !captain){
             throw new Error("All fields required")
        }

        const ride = await rideservice.confirmRide(rideId,captain)


        if(!ride){
             throw new Error("Ride not found in controller")
        }

        
        
        //const userId = ride.user._id.toString()
       //const socketId = getuserSocketId(userId)

         
         const io = getIO()
         
        
         const captainsocketId = captain.socketId
        if(captainsocketId){
             io.in(captainsocketId).socketsJoin(roomId)    //captain joins room
        }

        io.to(ride.user.socketId).emit("start:chat",     //notify user
              roomId
        )


        io.to(ride.user.socketId ).emit("ride-confirmed" ,{
           message:"Ride accepted",
           ride
        })

        return res.status(200).json({roomId, ride})
        
}

module.exports.StartRide = async(req,res)=>{
      const {rideId, OTP} = req.body
       const captain = req.captain
       if(!rideId || !OTP || !captain){
          throw new Error("All fields required")
       }
        
       const ride = await rideservice.Startride(rideId, OTP , captain)
          const io = getIO()
       try {
        io.to(ride.user.socketId, {
            event:"ride-started",
            data:ride
         })

         return res.status(200).json(ride)
       } catch (error) {
           res.status(500).json({message:error.message})
       }
}


module.exports.Endride = async(req,res)=>{
            
        const {rideId} = req.body
        const captain = req.captain

        const ride = await rideservice.Endride(rideId,captain)

        if(!ride){
           throw new Error("Ride not found ")
        }
        const io = getIO()
        try {
           io.to(ride.user.socketId ,{
              event:"End-ride",
              data:ride
           })
         return  res.status(200).json(ride)
        } catch (error) {
             res.status(500).json({message:error.message})
        }
        
}