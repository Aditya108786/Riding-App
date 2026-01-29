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
           

           const captains = await mapservice.getCaptaininTheRadius(pickup[1] , pickup[0] , 30)
           console.log("captains" , captains)
           ride.OTP = null
           const ridewithuser = await ridemodel.findOne({_id:ride._id}).populate('user' , '-password -resetpasswordtoken -resetpasswordexpire')
            console.log("hrsd" , ridewithuser)
          const io = getIO();
captains.forEach((captain) => {
    if (captain.socketId) {  // ✅ Check if socketId exists
        console.log("Notifying captain:", captain.socketId);
        io.to(captain.socketId).emit("newride", {
            message: 'A new ride request',
            ridewithuser
        });
    } else {
        console.log("⚠️ Captain has no active socket:", captain._id);
    }
});
           
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


module.exports.ConfirmRide = async(req, res) => {
  try {
    const { rideId } = req.body;
    const captain = req.captain;
    
    // Validate inputs
    if (!rideId || !captain) {
      return res.status(400).json({ message: "All fields required" });
    }

    const roomId = `chat_${rideId}`;

    // Confirm the ride
    const ride = await rideservice.confirmRide(rideId, captain);

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    // Check if user has a socket connection
    if (!ride.user || !ride.user.socketId) {
      console.log("⚠️ User has no active socket connection");
      return res.status(200).json({ 
        roomId, 
        ride,
        warning: "User is offline, notifications may not be delivered"
      });
    }

    const io = getIO();
    
    // Captain joins the chat room
    const captainSocketId = captain.socketId;
    if (captainSocketId) {
      const captainSocket = io.sockets.sockets.get(captainSocketId);
      if (captainSocket) {
        captainSocket.join(roomId);
        console.log(`✅ Captain ${captain._id} joined room: ${roomId}`);
      } else {
        console.log(`⚠️ Captain socket ${captainSocketId} not found`);
      }
    } else {
      console.log("⚠️ Captain has no socketId");
    }
      console.log(ride.user.socketId)
      console.log(ride.ridewithuser.user.socketId)
    // Notify user to start chat
    io.to(ride.user.socketId).emit("start:chat", roomId);
    console.log(`📢 Sent start:chat to user: ${ride.user.socketId}`);

    // Notify user that ride is confirmed
    io.to(ride.user.socketId).emit("ride-confirmed", {
      message: "Ride accepted",
      ride
    });
    console.log(`✅ Sent ride-confirmed to user: ${ride.user.socketId}`);

    return res.status(200).json({ roomId, ride });
    
  } catch (error) {
    console.error("❌ Error in ConfirmRide:", error);
    return res.status(500).json({ 
      message: error.message || "Failed to confirm ride" 
    });
  }
};

module.exports.StartRide = async(req,res)=>{
      const {rideId, OTP} = req.body
       const captain = req.captain
       if(!rideId || !OTP || !captain){
          throw new Error("All fields required")
       }
        
       const ride = await rideservice.Startride(rideId, OTP , captain)
          const io = getIO()
       try {
        io.to(ride.user.socketId).emit("ride-started" ,ride)
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
           io.to(ride.user.socketId).emit("End-ride" , ride)
         return  res.status(200).json(ride)
        } catch (error) {
             res.status(500).json({message:error.message})
        }
        
}