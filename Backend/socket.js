



const socketIO = require('socket.io')
const {createClient} = require("redis")
const {createAdapter} = require("@socket.io/redis-adapter")
const usermodel = require('./models/user.model');
const captainModel = require('./models/captain.model');
 


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

    const pubClient = createClient({
  url: process.env.REDIS_URL,
  socket: {
    tls: true,
    keepAlive: 10000,        // VERY IMPORTANT
    reconnectStrategy: (retries) => {
      console.log("🔁 Redis reconnect attempt:", retries);
      return Math.min(retries * 100, 3000); // retry delay
    },
  },
});

pubClient.on("error", (err) => {
  console.error("❌ Redis Pub Client Error:", err.message);
});

pubClient.on("connect", () => {
  console.log("✅ Redis Pub Client connected");
});

const subClient = pubClient.duplicate();

subClient.on("error", (err) => {
  console.error("❌ Redis Sub Client Error:", err.message);
});
     
     await pubClient.connect()
    await subClient.connect()

    io.adapter(createAdapter(pubClient,subClient))
     

    io.on('connection' , (socket)=>{
        console.log(`client connected : ${socket.id}`)


       socket.on('join', async (data) => {
   
    

    const { userId, userType } = data

    if (userType === 'user') {
        console.log("ENTERED USER BLOCK")

        await usermodel.findByIdAndUpdate(userId, {
            socketId: socket.id
        })

        
       

    } else if (userType === 'captain') {
        console.log("ENTERED CAPTAIN BLOCK")

        await captainModel.findByIdAndUpdate(userId, {
            socketId: socket.id
        })

       
       
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

        // Listen for captain location updates and forward them to the user of this ride
        socket.on('captain-location', async(data) => {
            try {
                const { userSocketId,captainId, rideId, lat, lng } = data || {};
               
                  console.log("kaun",captainId)
                  console.log("Live location" , lat , lng)
                
                  
        io.to(userSocketId).emit("captain-live-location" , {
              lat,
              lng
        })

             const captain = await captainModel.findByIdAndUpdate(
  captainId,
  {
    location: {
      type: 'Point',
      coordinates: [lng, lat] // 🔴 longitude FIRST
    }
  },
  { new: true }
);


                
            } catch (err) {
                console.error('Error handling captain-location', err);
            }
        });


       

        socket.on('disconnect' , ()=>{
            console.log(`client disconnected ${socket.id}`)
            
  
        })
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

