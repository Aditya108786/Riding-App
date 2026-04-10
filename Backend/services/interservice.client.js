const axios = require('axios')
const services = require('../config/services')

const INTERNAL_TIMEOUT_MS = Number(process.env.INTERNAL_HTTP_TIMEOUT_MS || 5000)

const internalHeaders = () => ({
  'x-service-key': process.env.INTERNAL_SERVICE_KEY || '',
})

async function getInternalUserById(userId) {
  const response = await axios.get(`${services.userServiceUrl}/user/internal/${userId}`, {
    headers: internalHeaders(),
    timeout: INTERNAL_TIMEOUT_MS,
  })
  return response.data?.user || null
}

async function getInternalCaptainById(captainId) {
  const response = await axios.get(`${services.captainServiceUrl}/captain/internal/${captainId}`, {
    headers: internalHeaders(),
    timeout: INTERNAL_TIMEOUT_MS,
  })
  return response.data?.captain || null
}

module.exports = {
  getInternalUserById,
  getInternalCaptainById,
}
