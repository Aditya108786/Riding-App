
const mongoose = require('mongoose')


const Rideschema = new mongoose.Schema({
         user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'user',
            required:true
         },

         captain:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'captain'
         },

         fare:{
            type:Number,
            required:true

         },

         pickup:{
            type:[Number],
            required:true

         },
         destination:{
            type:[Number],
            required:true

         },

         status:{
            type:String,
            enum:['Pending' ,'Accepted','ongoing', 'Completed' , 'Canceled'],
            default:'Pending'
         } ,

         duration:{
            type:Number
         } , 

         distance:{
            type:Number
         },

         paymentId:{
            type:String
         },

         orderId:{
            type:String
         },
         signature:{
            type:String
         },
         OTP:{
            type:String,
            select:false,
            required:true
         }
         
        

})






module.exports = mongoose.model('ride' , Rideschema)