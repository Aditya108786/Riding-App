const socketIO = require('socket.io')
const { connectRedis } = require('./config/Redis')
const { createAdapter } = require('@socket.io/redis-adapter')
const captainModel = require('./models/captain.model')
const Ride = require('./models/ride.model')

let io

async function initializesocket(server) {
  io = socketIO(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ['GET', 'POST'],
      credentials: true
    }
  })

  const redis = await connectRedis()
  if (!redis) {
    throw new Error('Redis client not initialized')
  }

  const subClient = redis.duplicate()
  await subClient.connect()
  io.adapter(createAdapter(redis, subClient))

  io.on('connection', (socket) => {
    socket.on('join', async (data) => {
      const { userId, userType } = data || {}
      if (!userId || !userType) return

      if (userType === 'user') {
        await redis.set(`user:${userId}`, socket.id, { EX: 3600 })
        socket.userId = userId
        socket.userType = 'user'
        return
      }

      if (userType === 'captain') {
        await redis.set(`captain:${userId}`, socket.id, { EX: 3600 })
        socket.captainId = userId
        socket.userType = 'captain'
      }
    })

    socket.on('start:chat-room', (roomId) => {
      if (!roomId) return
      socket.join(roomId)
    })

    socket.on('send:message', ({ roomId, sender, message }) => {
      if (!roomId || !sender || !message) return
      io.to(roomId).emit('receive:message', {
        roomId,
        sender,
        message,
        time: new Date().toLocaleTimeString()
      })
    })

    socket.on('captain-location-update', async (data) => {
      const { lat, lng } = data || {}
      if (lat == null || lng == null || !socket.captainId) {
        return
      }

      await redis.geoAdd('captains:locations', {
        longitude: lng,
        latitude: lat,
        member: socket.captainId.toString()
      })
    })

    socket.on('captain-location', async (data) => {
      try {
        const { captainId, rideId, lat, lng } = data || {}

        if (!captainId || lat == null || lng == null) {
          return
        }

        // Prevent spoofing another captain's location via socket payload.
        if (socket.userType !== 'captain' || String(socket.captainId) !== String(captainId)) {
          return
        }

        await captainModel.findByIdAndUpdate(
          captainId,
          {
            location: {
              type: 'Point',
              coordinates: [lng, lat]
            }
          },
          { new: true }
        )

        const ride = rideId
          ? await Ride.findById(rideId)
          : await Ride.findOne({
              captain: captainId,
              status: { $in: ['Accepted', 'ongoing', 'Ongoing'] }
            })

        if (!ride) return

        const roomId = `chat_${ride._id}`

        io.to(roomId).emit('captain-live-location', { lat, lng })

        const userId = ride.user?._id || ride.user
        const userSocketId = await redis.get(`user:${userId}`)
        if (userSocketId) {
          io.to(userSocketId).emit('captain-live-location', { lat, lng })
        }
      } catch (err) {
        console.error('Error handling captain-location:', err)
      }
    })

    socket.on('disconnect', async () => {
      if (socket.userType === 'user' && socket.userId) {
        await redis.del(`user:${socket.userId}`)
      }

      if (socket.userType === 'captain' && socket.captainId) {
        await redis.del(`captain:${socket.captainId}`)
      }
    })
  })
}

function getIO() {
  if (!io) {
    throw new Error('socket.io is not initialized')
  }
  return io
}

module.exports = { initializesocket, getIO }
