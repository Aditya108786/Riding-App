
const captainModel = require('../models/captain.model')

module.exports.createCaptain = async({firstname, lastname, email, password,color,phone,
    plate, capacity,vehicleType})=>{
     
        if(!firstname || !email || !password || !color || !phone || !plate || !capacity || !vehicleType){
            
            throw new Error('All fields are required')
        }

        const captain = await captainModel.create({
            fullname:{
                firstname,
                lastname
            },
            email,
            password,
            phone,
            vehicle:{
                color,
                plate,
                capacity,
                vehicleType
            }
        })

        return captain

    }