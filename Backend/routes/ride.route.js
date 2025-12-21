
const express = require('express')

const router = express.Router()
const ridecontroller = require('../controllers/ride.controller')
const middlewares = require('../middlewares/auth.middleware')


router.post('/createride',middlewares.authUser, ridecontroller.createRide)
router.post('/getfare', middlewares.authUser, ridecontroller.getfare)
router.post('/confirmride' , middlewares.authCaptain , ridecontroller.ConfirmRide)
router.post('/startride' , middlewares.authCaptain, ridecontroller.StartRide)
router.post('/endride' , middlewares.authCaptain, ridecontroller.Endride)


module.exports = router