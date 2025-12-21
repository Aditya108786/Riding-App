
const usermodel = require('../models/user.model')
const jwt = require('jsonwebtoken')
const bcrypt= require('bcryptjs')
const blacklistTokenModel = require('../models/blacklistToken')
const captainModel = require('../models/captain.model')

module.exports.authUser = async(req,res,next)=>{
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]
    console.log("token ji",token)
    if(!token){
        return res.status(401).json({message: "Unauthorized access"})

    }

    const blacklistToken = await blacklistTokenModel.findOne({token:token})
 if(blacklistToken){
        return res.status(401).json({message: "Unauthorized access"})
    }

try {
     const decoded = jwt.verify(token, process.env.JWT_SECRET)
     console.log("DECODEED",decoded)
       req.user = await usermodel.findById(decoded._id)
       console.log(req.user)
       
         next()
} catch (error) {
    return res.status(401).json({message: "Unauthorized access"})
   
    
}
}


module.exports.authCaptain = async function(req,res,next){
    const token = req.cookies.captaintoken || req.headers.authorization?.split(" ")[1]
    console.log(token)
      
    if(!token){
        return res.status(401).json({message:"Unauthorized access"})
    }

    const blacklistToken = await blacklistTokenModel.findOne({token:token})
    if(blacklistToken){
        return res.status(401).json({message:" Unauthorized access"})
    }

    try {
        const decoded = jwt.verify(token , process.env.JWT_SECRET)
        req.captain = await captainModel.findById(decoded._id)
        next()
    } catch (error) {
        return res.status(401).json({message:" Unauthorized access"})
        
    }
}