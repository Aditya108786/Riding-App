const rideservice  = require('../services/ride.services')
const mapservice = require('../services/map.service')
const ridemodel = require('../models/ride.model')
const {getRedis} = require("../config/Redis")
const pubClient = require('../socket')
const {getIO , sendmessagetosocketid, getuserSocketId  , captainsockets} = require('../socket')


module.exports.createRide = async(req , res)=>{
     const { vehicleType, pickup , destination} = req.body
     
       

     try {
         const redis = getRedis()
        const ride = await rideservice.createride({pickup , destination , user:req.user._id,vehicleType })
        console.log("rde" , pickup)
        
        //const coordinates = await mapservice.addresscoordinate(pickup)
          // console.log("PICKUP",coordinates)
           
           res.status(201).json(ride)
           

           //const captains = await mapservice.getCaptaininTheRadius(pickup[1] , pickup[0] , 30)
              const captains = await redis.geoSearch(
                        "captains:locations",
                       {longitude:pickup[0],latitude:pickup[1]},
                        {radius:50, unit:"km"}
              )
              if(!captains){
                  return res.status(200).json({
                    message:"No nearby captains",
                    ride
                  })
              }
           console.log("captains" , captains)
           ride.OTP = null
           const ridewithuser = await ridemodel.findOne({_id:ride._id}).populate('user' , '-password -resetpasswordtoken -resetpasswordexpire')
            console.log("hrsd" , ridewithuser)
          const io = getIO();
for(const captainId of captains ){
     console.log("Captain ID:", captainId);

  const captainSocketId = await redis.get(`captain:${captainId}`);
  console.log("Socket:", captainSocketId);

  if (captainSocketId) {
    io.to(captainSocketId).emit("newride", {
      ride: ridewithuser
    });
  }
}
           
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


module.exports.ConfirmRide = async (req, res) => {
  const { rideId } = req.body;
    console.log("ciiiii",req.captain)

  try {
    const { rideId } = req.body;
    console.log("ciiiii",req.captain)
    const captain = req.captain;

    if (!rideId || !captain) {
      return res.status(400).json({ message: "All fields required" });
    }

    const redis = getRedis();
    const io = getIO();
    const roomId = `chat_${rideId}`;

    // 1️⃣ Confirm ride
    const ride = await rideservice.confirmRide(rideId, captain);
    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    // 2️⃣ Get socket IDs from Redis
    const captainSocketId = await redis.get(`captain:${captain._id}`);
    const userSocketId = await redis.get(`user:${ride.user}`);

    if (!userSocketId) {
      console.log("⚠️ User offline");
      return res.status(200).json({
        roomId,
        ride,
        warning: "User offline"
      });
    }

    // 3️⃣ Captain joins chat room
    if (captainSocketId) {
      const captainSocket = io.sockets.sockets.get(captainSocketId);
      if (captainSocket) {
        captainSocket.join(roomId);
        console.log(`✅ Captain joined room ${roomId}`);
      }
    }

    // 4️⃣ Notify user
    io.to(userSocketId).emit("start:chat", roomId);
    io.to(userSocketId).emit("ride-confirmed", {
      message: "Ride accepted",
      ride
    });

    return res.status(200).json({ roomId, ride });

  } catch (error) {
    console.error("❌ ConfirmRide error:", error);
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
          const redis = getRedis()
         // const captainSocketId = await redis.get(`captainId:${captain._id}`)
          const userSocketId = await redis.get(`userId:${ride.user._id}`)
       try {
        io.to(userSocketId).emit("ride-started" ,ride)
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
        const redis = await getRedis()
        const userSocketId = await redis.get(`userId:${ride.user._id}`)
        try {
           io.to(userSocketId).emit("End-ride" , ride)
         return  res.status(200).json(ride)
        } catch (error) {
             res.status(500).json({message:error.message})
        }
        
}