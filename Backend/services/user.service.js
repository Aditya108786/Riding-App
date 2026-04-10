
const usermodel = require('../models/user.model')


module.exports.createUser = async({firstname,lastname,email,phone, password})=>{
    if(!firstname|| !email || !phone || !password){
        throw new Error('All fields are required')

    }

    const user = await usermodel.create({
        fullname:{
            firstname: firstname.trim(),
            lastname: (lastname || '').trim()
        },
        email: email.trim(),
        phone: phone.trim(),
        password

    })

    return user 
}
