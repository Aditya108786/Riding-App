const { Error } = require('mongoose')
const rideModel = require('../models/ride.model')
const ridemodel = require('../models/ride.model')
const mapservice = require('../services/map.service')


async function getfare(pickup , destination){

    if(!pickup || !destination){
        throw new Error('Pickup and destination are required')
    }

    const distandtime = await mapservice.getdistancetime(pickup , destination)
    //console.log(distandtime)
     
    const dist =   distandtime.routes[0].summary.distance
    console.log(dist)
    const time = distandtime.routes[0].summary.duration
            
    const baseFare = {
        auto:30,
        car:50,
        bike:20
    }

    const perKmRate = {
           auto:10,
           car:15,
           bike:8
    }

    const perMinuteRate = {
        auto:2,
        car:3,
        bike:1.5
    }

    const fare = {
  auto: Number((baseFare.auto + (dist / 1000 * perKmRate.auto) + (perMinuteRate.auto * time / 60)).toFixed(2)),
  car: Number((baseFare.car + (dist / 1000 * perKmRate.car) + (perMinuteRate.car * time / 60)).toFixed(2)),
  bike: Number((baseFare.bike + (dist / 1000 * perKmRate.bike) + (perMinuteRate.bike * time / 60)).toFixed(2))
};

    return fare

}


function getOTP(num){
    function generateOTP(num) {
  // Check if crypto.randomInt exists (Node >=14.10)
  if (typeof crypto.randomInt === "function") {
    return crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num)).toString();
  }

  // Fallback for older Node versions
  const otp = Math.floor(
    Math.pow(10, num - 1) + Math.random() * (Math.pow(10, num) - Math.pow(10, num - 1))
  );
  return otp.toString();
}
      return generateOTP(num)
}

module.exports.createride = async({pickup, destination , user,  vehicleType})=>{
     
    if(!user || !pickup || !destination || !vehicleType){
        throw new Error('All fields are required')
    }

    const fare = await getfare(pickup , destination)
   
      const ride = await ridemodel.create({
            user,
            pickup,
            destination,
            fare:fare[vehicleType],
            vehicleType,
            OTP:getOTP(4)


      })

      return ride
}

module.exports.getprice = async({pickup , destination, vehicleType})=>{

      console.log(pickup, destination)
         if(!pickup || !destination || !vehicleType){
            throw new Error("pickup and destination required")
         }

         const fare = await getfare(pickup, destination)
          
         return fare[vehicleType]
}

module.exports.confirmRide = async(rideId , captain)=>{
            
        if(!rideId || !captain){
          throw new Error(" confirmride RideId is required")
        }

       const ride =  await ridemodel.findOneAndUpdate({_id:rideId} , {
              status:'Accepted',
              captain:captain._id
        },{
          new:true
        }).populate("user").populate("captain").select("+OTP")

        if(!ride){
           throw new Error("Ride not found")
        }

        return ride

       
}


module.exports.Startride = async(rideId, OTP , captain)=>{
         
      if(!rideId || !OTP || !captain){
        throw new Error(" start ride All fields required")
      }

      const ride = await ridemodel.findOneAndUpdate({
            _id:rideId,
            OTP:OTP,
            status:"Accepted"
      },
    {
        status:"ongoing",
        captain:captain._id
    },{
      new:true
    }).populate("user").populate("captain").select("+OTP")
         

    if (!ride) {
    throw new Error("Invalid OTP or ride not accepted");
  }

  return ride;
}

module.exports.Endride = async(rideId , captain)=>{
     
      if(!rideId){
        throw new Error("RideId required")
      }

      try {
         const ride = await ridemodel.findOneAndUpdate({
             _id:rideId,
             status:"ongoing"
         }, {
              status:"completed"
         },{
          new:true
         }).populate("user")

         if(!ride){
             throw new Error("Ride not found ")
         }

         return ride
      } catch (error) {
           return (error.message)
      }
}