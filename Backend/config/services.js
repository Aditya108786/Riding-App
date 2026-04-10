const BASE_GATEWAY = process.env.API_GATEWAY_URL || process.env.BASE_SERVICE_URL || `http://localhost:${process.env.PORT || 5000}`

module.exports = {
  userServiceUrl: process.env.USER_SERVICE_URL || BASE_GATEWAY,
  captainServiceUrl: process.env.CAPTAIN_SERVICE_URL || BASE_GATEWAY,
  rideServiceUrl: process.env.RIDE_SERVICE_URL || BASE_GATEWAY,
  realtimeServiceUrl: process.env.REALTIME_SERVICE_URL || BASE_GATEWAY,
}
