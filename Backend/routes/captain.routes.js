
const express = require('express')

const router = express.Router()
const {body} = require('express-validator')
const captainController = require('../controllers/captain.controller')
const authMiddleware = require('../middlewares/auth.middleware')


router.post('/register',[
    body('email').isEmail().withMessage('Invalid email'),
    body('fullname.firstname').isLength({min:3}).withMessage('First name must be at least 3 characters long'),
    body('password').isLength({min:6}).withMessage('Password must be minimum 6'),
    body('phone').isLength({min:10}).withMessage('Phone number must be at least 10 characters long'),
    body('vehicle.color').isLength({min:3}).withMessage('Vehicle color must be at least 3 characters long'),
    body('vehicle.plate').isLength({min:3}).withMessage('Vehicle plate must be at least 3 characters long'),
    body('vehicle.capacity').isInt({min:1}).withMessage('Vehicle capacity must be at least 1'),
    body('vehicle.vehicleType').isIn(['car','bike','auto']).withMessage('Vehicle type must be car, bike or auto')
], captainController.registerCaptain)   


router.post('/login', [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({min:6}).withMessage('Password must be minimum 6')
], captainController.captainLogin)

router.get('/profile', authMiddleware.authCaptain, captainController.getCaptainprofile)

router.get('/logout', authMiddleware.authCaptain, captainController.logoutCaptain)

router.get('/auth' ,authMiddleware.authCaptain , captainController.auth)


module.exports = router