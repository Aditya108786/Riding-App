
const captainModel = require('../models/captain.model')

module.exports.createCaptain = async({firstname, lastname, email, password,color,phone,
    plate, capacity,vehicleType})=>{
     
        if(!firstname || !email || !password || !color || !phone || !plate || !capacity || !vehicleType){
            
            throw new Error('All fields are required')
        }

        const captain = await captainModel.create({
            fullname:{
                firstname: firstname.trim(),
                lastname: (lastname || '').trim()
            },
            email: email.trim(),
            password,
            phone: phone.trim(),
            vehicle:{
                color: color.trim(),
                plate: plate.trim(),
                capacity: Number(capacity),
                vehicleType
            }
        })

        return captain
        

    }
