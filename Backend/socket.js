



const socketIO = require('socket.io')
const {connectRedis , getRedis} = require("./config/Redis")
const {createAdapter} = require("@socket.io/redis-adapter")
const usermodel = require('./models/user.model');
const captainModel = require('./models/captain.model');
const Ride = require('./models/ride.model')
 


let io;

//let captainsockets = {}  // captainId -> usersocketid
//let usersockets = {}  // userid -> captainsocketid


/*function getuserSocketId(userId){
    return usersockets[userId]
}

function getcaptainsocket(captainId){
     return captainsockets[captainId]
}*/

async function initializesocket(server){
    io = socketIO(server,{
        cors:{
            origin:process.env.CLIENT_URL,
            methods:['GET' , "POST"],
              credentials:true
        }
    });

     const redis = await connectRedis()
     const subClient = redis.duplicate()
     await subClient.connect()

    io.adapter(createAdapter(redis,subClient))
     

    io.on('connection' , (socket)=>{
        console.log(`client connected : ${socket.id}`)
          socket.on('join', async (data) => {
          const { userId, userType } = data

          if(!userId || !userType){
             return;
          }

    if (userType === 'user') {
        console.log("ENTERED USER BLOCK")

        /*await usermodel.findByIdAndUpdate(userId, {
            socketId: socket.id
        })*/

        await redis.set(`user:${userId}`, socket.id , {EX:3600})
        socket.userId = userId
        socket.userType = "user"
        
       

    } else if (userType === 'captain') {
        console.log("ENTERED CAPTAIN BLOCK")

       /* await captainModel.findByIdAndUpdate(userId, {
            socketId: socket.id
        })*/

        await redis.set(`captain:${userId}`, socket.id , {EX:3600})
        socket.captainId = userId
        socket.userType = "captain"

       
       
    } else {
        console.log("❌ INVALID userType:", userType)
    }
})


socket.on("start:chat-room" , (roomId)=>{
     socket.join(roomId)
     console.log(`SocketId${socket.id} joined from roomId ${roomId}`)
})

socket.on("send:message" ,({roomId, sender, message}) =>{
     io.to(roomId).emit("receive:message" , {
        sender,
        message,
        time:new Date().toLocaleTimeString()
     })
})

      socket.on("captain-location-update", async(data)=>{
        const {lat,lng} = data || {}
        if(!lat || !lng){
            return ;
        }
          const captainId = socket.captainId

            await redis.geoAdd("captains:locations",{
                 longitude:lng,
                 latitude:lat,
                 member:captainId.toString()
            })
      })
     

        // Listen for captain location updates and forward them to the user of this ride
        socket.on("captain-location", async (data) => {
  try {
    const { captainId, lat, lng } = data || {};

    if (!captainId || lat == null || lng == null) {
      console.log("❌ Invalid captain-location payload:", data);
      return;
    }

    console.log("📍 Captain:", captainId);
    console.log("📍 Live location:", lat, lng);

    // 1️⃣ Update captain location
    await captainModel.findByIdAndUpdate(
      captainId,
      {
        location: {
          type: "Point",
          coordinates: [lng, lat]
        }
      },
      { new: true }
    );

    // 2️⃣ Find active ride for this captain
    const ride = await Ride.findOne({
      captain: captainId,
      status: { $in: ["Accepted", "Ongoing"] }
    });

    if (!ride) return;

    // 3️⃣ Fetch user socketId from DB
    const user = await usermodel.findById(ride.user).select("socketId");
    if (!user?.socketId) return;

    // 4️⃣ Emit live location to user
    io.to(user.socketId).emit("captain-live-location", {
      lat,
      lng
    });

  } catch (err) {
    console.error("❌ Error handling captain-location:", err);
  }
});



       

       socket.on('disconnect', async () => {
    console.log(`Client disconnected: ${socket.id}`);
    
    // Clean up user socketId
    if(socket.userType == "user" && socket.userId){
      await redis.del(`user:${socket.userId}`)
    }

    if(socket.userType == "captain" && socket.captainId){
         await redis.del(`captain:${socket.captainId}`)
    }
});
    })
}


/*function sendmessagetosocketid(socketID, messageObject){
    if(io){
        io.to(socketID).emit(messageObject.event, messageObject.data)
    }else{
        console.log('socket.io is not initialized')
    }
}*/

function getIO(){
    if(!io){
        throw new Error('socket.io is not initializes')
    }
    return io
}

module.exports = { initializesocket,  getIO}

