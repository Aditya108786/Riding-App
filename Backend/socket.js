
const socketIO = require('socket.io')
const usermodel = require('./models/user.model');
const captainModel = require('./models/captain.model');

let io;
let captainsockets = {}  // captainId -> usersocketid
let usersockets = {}  // userid -> captainsocketid


function getuserSocketId(userId){
    return usersockets[userId]
}

function getcaptainsocket(captainId){
     return captainsockets[captainId]
}

function initializesocket(server){
    io = socketIO(server,{
        cors:{
            origin: [
            "http://localhost:5173",
            "https://cj95bg1g-5173.inc1.devtunnels.ms"
        ],
            methods:['GET' , "POST"]

        }
    });

    io.on('connection' , (socket)=>{
        console.log(`client connected : ${socket.id}`)


       socket.on('join', async (data) => {
   
    

    const { userId, userType } = data

    if (userType === 'user') {
        console.log("ENTERED USER BLOCK")

        await usermodel.findByIdAndUpdate(userId, {
            socketId: socket.id
        })

        usersockets[userId] = socket.id
       

    } else if (userType === 'captain') {
        console.log("ENTERED CAPTAIN BLOCK")

        await captainModel.findByIdAndUpdate(userId, {
            socketId: socket.id
        })

        captainsockets[userId] = socket.id
       
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
                const { userId,captainId, rideId, lat, lng } = data || {};
               
                  console.log("kaun",captainId)
                  console.log("Live location" , lat , lng)
                const userSocketId = usersockets[userId];
                  
        io.to(userSocketId).emit("captain-live-location" , {
              lat,
              lng
        })

             const captain = await captainModel.findByIdAndUpdate(captainId , {
                  location:{
                       ltd:lat,
                       lng:lng
                  }
             })


                
            } catch (err) {
                console.error('Error handling captain-location', err);
            }
        });


       

        socket.on('disconnect' , ()=>{
            console.log(`client disconnected ${socket.id}`)
            for (const userId in usersockets) {
    if (usersockets[userId] === socket.id) {
      delete usersockets[userId];
    }
  }

  for (const captainId in captainsockets) {
    if (captainsockets[captainId] === socket.id) {
      delete captainsockets[captainId];
    }
  }
        })
    })
}


function sendmessagetosocketid(socketID, messageObject){
    if(io){
        io.to(socketID).emit(messageObject.event, messageObject.data)
    }else{
        console.log('socket.io is not initialized')
    }
}

function getIO(){
    if(!io){
        throw new Error('socket.io is not initializes')
    }
    return io
}

module.exports = { initializesocket, sendmessagetosocketid , getIO , getuserSocketId , captainsockets}

