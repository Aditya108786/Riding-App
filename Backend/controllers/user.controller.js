
const { validationResult } = require('express-validator')
const usermodel = require('../models/user.model')
const userService = require('../services/user.service')
const blacklistTokenModel = require('../models/blacklistToken')

module.exports.registerUser = async(req, res,next)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
   console.log(req.body)
    const {fullname, email , password} = req.body

    const hashpassword = await usermodel.hashpassword(password)
    console.log(hashpassword)

    const user = await userService.createUser({
        firstname:fullname.firstname,
        lastname:fullname.lastname,
        email,
        password:hashpassword
    })

    const token = user.generateAuthtoken()

    res.status(201).json({token, user})


}

module.exports.loginUser = async(req,res,next)=>{
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
    res.cookie('token', token , {
         sameSite:'Lax',  // allows cross-origin cookies
         httpOnly:true,    // prvent js access
         secure:false      // https only set true in production 
    })
    res.status(200).json({user})
} 

module.exports.getUserProfile = async(req,res,next)=>{
     
    res.status(200).json({user:req.user})
}

module.exports.reset_password = async(req,res)=>{
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

         return res.status(200).json(user)

        
                 

        
}

module.exports.logoutUser = async(req,res,next)=>{
    res.clearCookie('token')
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]
    
    await blacklistTokenModel.updateOne(
        {token},
        {$setOnInsert:{token}},
        {upsert:true}
        )
    res.status(200).json({message:'Logged out successfully'})
}

module.exports.auth = async(req,res)=>{
    res.status(200).json({user:req.user})
}