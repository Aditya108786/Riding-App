module.exports.requireInternalServiceKey = (req, res, next) => {
  const incoming = req.headers['x-service-key']
  const expected = process.env.INTERNAL_SERVICE_KEY

  if (!expected) {
    return res.status(500).json({ message: 'INTERNAL_SERVICE_KEY is not configured' })
  }

  if (!incoming || incoming !== expected) {
    return res.status(401).json({ message: 'Unauthorized internal request' })
  }

  next()
}
