
const socketIO = require('socket.io')
const usermodel = require('./models/user.model');
const captainModel = require('./models/captain.model');

let io;
let captainsockets = {}  // captainId -> usersocketid
let usersockets = {}  // userid -> captainsocketid


function getuserSocketId(userId){
    return usersockets[userId]
}

function initializesocket(server){
    io = socketIO(server,{
        cors:{
            origin:'*',
            methods:['GET' , "POST"]

        }
    });

    io.on('connection' , (socket)=>{
        console.log(`client connected : ${socket.id}`)


       socket.on('join', async (data) => {
    console.log("JOIN RAW DATA:", data)
    console.log("userType:", data?.userType, typeof data?.userType)

    const { userId, userType } = data

    if (userType === 'user') {
        console.log("ENTERED USER BLOCK")

        await usermodel.findByIdAndUpdate(userId, {
            socketId: socket.id
        })

        usersockets[userId] = socket.id
        console.log("mistkae", socket.id)

    } else if (userType === 'captain') {
        console.log("ENTERED CAPTAIN BLOCK")

        await captainModel.findByIdAndUpdate(userId, {
            socketId: socket.id
        })

        captainsockets[userId] = socket.id
        console.log("captainmistake", socket.id)
    } else {
        console.log("❌ INVALID userType:", userType)
    }
})

        // Listen for captain location updates and forward them to the user of this ride
        socket.on('captain-location', (data) => {
            try {
                const { userId, rideId, lat, lng } = data || {};
                if (!userId) return;

                const userSocketId = usersockets[userId];
                if (userSocketId) {
                    io.to(userSocketId).emit('captain-live-location', {
                        rideId,
                        lat,
                        lng,
                    });
                }
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

module.exports = { initializesocket, sendmessagetosocketid , getIO , getuserSocketId}

