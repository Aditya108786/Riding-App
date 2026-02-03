
const blacklistTokenModel = require('../models/blacklistToken')
const captainModel = require('../models/captain.model')
const captainService = require('../services/captain.service')
const Ride = require('../models/ride.model')
const {validationResult} = require('express-validator')

module.exports.registerCaptain = async function(req,res,next){
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
       res.cookie('token' , token , {
            sameSite:'None',
            httpOnly:true,
            secure:true
       }).status(201).json({captain})
}

module.exports.captainLogin = async(req,res,next)=>{
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
    res.cookie('captaintoken', token ,{
        sameSite:"None",
        secure:true,
        httpOnly:true

    })
    res.status(200).json({token, captain})
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

      res.status(200).json({
        ...captain.toObject(),
        stats: {
          totalRides,
          totalEarnings
        }
      })
    } catch (err) {
      res.status(200).json(captain)
    }
}

module.exports.reset_password = async(req,res)=>{
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
      return res.status(200).json(captain)

      

}



module.exports.logoutCaptain = async(req,res,next) =>{
    res.clearCookie('captaintoken')
    const token = req.cookies.captaintoken || req.headers.authorization?.split(" ")[1]
    await blacklistTokenModel.updateOne(
        {token},
        {$setOnInsert:{token}},
        {upsert:true}
    )
    res.status(200).json({message:'Logged out successfully'})
}

module.exports.auth = async(req,res)=>{
    res.status(200).json({captain:req.captain})
}

