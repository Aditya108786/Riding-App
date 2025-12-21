
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')


const userSchema = new mongoose.Schema({
    fullname:{
        firstname:{
            type:String,
            required:true,
            minlength:[3,'First name must be at least 3 characters']
        },
        lastname:{
            type:String,
            minlength:[3, 'Last name must be at least 3 characters']
        },
 },

 email:{
     type:String,
     required:true,

        unique:true,
        minlength:[5,'Email must be at least 5 characters long']
 },

    password:{
        type:String,
        required:true,
        select:false,
    },

 socketId:{
    type:String,
 }
})


userSchema.methods.generateAuthtoken = function(){
    const token = jwt.sign({_id:this._id}, process.env.JWT_SECRET , {expiresIn:86400})
    return token
}

userSchema.methods.comparepassword = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.statics.hashpassword = async function(password){
    return await bcrypt.hash(password, 10)
}

const usermodel = mongoose.model("user" , userSchema)

module.exports = usermodel
