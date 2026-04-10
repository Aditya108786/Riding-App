
const blacklistTokenModel = require('../models/blacklistToken')
const captainModel = require('../models/captain.model')
const captainService = require('../services/captain.service')
const Ride = require('../models/ride.model')
const {validationResult} = require('express-validator')

const getCookieOptions = () => ({
  sameSite: 'None',
  httpOnly: true,
  secure: true,
})

const sanitizeCaptain = (captainDoc) => {
  if (!captainDoc) return null
  const captain = captainDoc.toObject ? captainDoc.toObject() : { ...captainDoc }
  delete captain.password
  return captain
}

module.exports.registerCaptain = async function(req,res,next){
    try {
      const errors = validationResult(req)
      if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
      }

      const {fullname, email , password, vehicle, phone} = req.body

      const isCaptainAlreadyExist = await captainModel.findOne({email:email})
       if(isCaptainAlreadyExist){
        return res.status(400).json({message:'Captain already registered'})
       }

       const hashPassword = await captainModel.hashpassword(password)

       const captain = await captainService.createCaptain({
        firstname:fullname.firstname,
        lastname: fullname.lastname,
        email,
        password:hashPassword,
        color:vehicle.color,
        plate:vehicle.plate,
        capacity:vehicle.capacity,
        vehicleType:vehicle.vehicleType,
        phone

       })

       const token = await captain.generateAuthtoken()
       res
        .cookie('captaintoken' , token , getCookieOptions())
        .status(201)
        .json({token, captain: sanitizeCaptain(captain)})
    } catch (error) {
      return res.status(500).json({ message: error.message || 'Failed to register captain' })
    }
}

module.exports.captainLogin = async(req,res,next)=>{
    try {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    const {email, password} = req.body

    const captain = await captainModel.findOne({email}).select('+password')

    if(!captain){
        return res.status(401).json({message:'Invalid email or password'})
    }

    const isMatch = await captain.comparepassword(password)

    if(!isMatch){
        return res.status(401).json({message:'Invalid email or password'})
    }

    const token = await captain.generateAuthtoken()
    res
      .cookie('captaintoken', token, getCookieOptions())
      .status(200)
      .json({token, captain: sanitizeCaptain(captain)})
    } catch (error) {
      return res.status(500).json({ message: error.message || 'Failed to login captain' })
    }
}

module.exports.getCaptainprofile = async(req,res,next)=>{
    const captain = req.captain
    try {
      const totalRides = await Ride.countDocuments({
        captain: captain._id,
        status: "Completed"
      })

      const earningsAgg = await Ride.aggregate([
        { $match: { captain: captain._id, status: "Completed" } },
        { $group: { _id: null, total: { $sum: "$fare" } } }
      ])
      const totalEarnings = earningsAgg?.[0]?.total || 0

      await captainModel.updateOne(
        { _id: captain._id },
        { $set: { Rides: totalRides, Revenue: totalEarnings } }
      )

      return res.status(200).json({
        ...sanitizeCaptain(captain),
        Rides: totalRides,
        Revenue: totalEarnings
      })
    } catch (err) {
      return res.status(500).json({ message: 'Failed to fetch captain profile' })
    }
}

module.exports.reset_password = async(req,res)=>{
      try {
      const {email, password} = req.body

      const errors = validationResult(req)
      if(!errors.isEmpty()){
         return res.status(400).json({errors:errors.array()})
      }

      const hashPassword = await captainModel.hashpassword(password)

      const captain = await captainModel.findOne({email:email})
        
      if(!captain){
         return res.status(401).json({message:"Invalid email"})
      }

      captain.password = hashPassword
      await captain.save()
      return res.status(200).json({ message: 'Password reset successful' })

      } catch (error) {
        return res.status(500).json({ message: error.message || 'Failed to reset password' })
      }

}



module.exports.logoutCaptain = async(req,res,next) =>{
    try {
    res.clearCookie('captaintoken', getCookieOptions())
    const token = req.cookies.captaintoken || req.headers.authorization?.split(" ")[1]
    if (token) {
      await blacklistTokenModel.updateOne(
          {token},
          {$setOnInsert:{token}},
          {upsert:true}
      )
    }
    res.status(200).json({message:'Logged out successfully'})
    } catch (error) {
      return res.status(500).json({ message: error.message || 'Failed to logout captain' })
    }
}

module.exports.auth = async(req,res)=>{
    res.status(200).json({captain:sanitizeCaptain(req.captain)})
}

module.exports.getInternalCaptainById = async (req, res) => {
    try {
      const captain = await captainModel.findById(req.params.id)
      if (!captain) {
        return res.status(404).json({ message: 'Captain not found' })
      }

      return res.status(200).json({ captain: sanitizeCaptain(captain) })
    } catch (error) {
      return res.status(500).json({ message: error.message || 'Failed to fetch captain' })
    }
}

