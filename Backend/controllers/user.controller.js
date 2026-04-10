
const { validationResult } = require('express-validator')
const usermodel = require('../models/user.model')
const userService = require('../services/user.service')
const blacklistTokenModel = require('../models/blacklistToken')

const getCookieOptions = () => ({
    sameSite: 'None',
    httpOnly: true,
    secure: true
})

const sanitizeUser = (userDoc) => {
    if (!userDoc) return null
    const user = userDoc.toObject ? userDoc.toObject() : { ...userDoc }
    delete user.password
    return user
}

module.exports.registerUser = async(req, res,next)=>{
    try {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
   
    const {fullname, email , password,phone} = req.body

    const hashpassword = await usermodel.hashpassword(password)
    

    const user = await userService.createUser({
        firstname:fullname.firstname,
        lastname:fullname.lastname,
        email,
        phone,
        password:hashpassword
    })

    const token = user.generateAuthtoken()
     
   return res
    .cookie('token' , token , getCookieOptions())
    .status(201)
    .json({user: sanitizeUser(user)})
    } catch (error) {
        return res.status(500).json({ message: error.message || 'Failed to register user' })
    }


}

module.exports.loginUser = async(req,res,next)=>{
   try {
    const errors = validationResult(req)
   if(!errors.isEmpty()){
      return res.status(400).json((  {errors:errors.array()}
      ))
   }
  
   const {email, password} = req.body
    
   const user = await usermodel.findOne({email}).select('+password')

   if(!user){
     return res.status(401).json({message:'Invalid email or password'})
   }

   const ismatch = await user.comparepassword(password)
    if(!ismatch){
        return res.status(401).json({message:'Invalid email or password'})
    }

   const token = user.generateAuthtoken()
    return res
      .cookie('token', token, getCookieOptions())
      .status(200)
      .json({user: sanitizeUser(user)})
   } catch (error) {
      return res.status(500).json({ message: error.message || 'Failed to login user' })
   }
} 

module.exports.getUserProfile = async(req,res,next)=>{
     
    res.status(200).json({user:sanitizeUser(req.user)})
}

module.exports.reset_password = async(req,res)=>{
        try {
        const {email , password} = req.body

        const errors = validationResult(req)

        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()})
        }

        const hashpassword = await usermodel.hashpassword(password)
        const user = await usermodel.findOne({email:email} )

        if(!user){
            return res.status(401).json({message:"Invalid email"})
        }

         user.password = hashpassword
         await user.save()

         return res.status(200).json({ message: "Password reset successful" })

        } catch (error) {
            return res.status(500).json({ message: error.message || 'Failed to reset password' })
        }
                 

        
}

module.exports.logoutUser = async(req,res,next)=>{
    try {
    res.clearCookie('token', getCookieOptions())
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]
    
    if (token) {
        await blacklistTokenModel.updateOne(
            {token},
            {$setOnInsert:{token}},
            {upsert:true}
            )
    }
    return res.status(200).json({message:'Logged out successfully'})
    } catch (error) {
        return res.status(500).json({ message: error.message || 'Failed to logout user' })
    }
}

module.exports.auth = async(req,res)=>{
    res.status(200).json({user:sanitizeUser(req.user)})
}

module.exports.getInternalUserById = async (req, res) => {
    try {
        const user = await usermodel.findById(req.params.id)
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        return res.status(200).json({ user: sanitizeUser(user) })
    } catch (error) {
        return res.status(500).json({ message: error.message || 'Failed to fetch user' })
    }
}
