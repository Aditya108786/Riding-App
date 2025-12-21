
const express = require('express')
const router = express.Router()
const {body} = require('express-validator')
const { registerUser,loginUser } = require('../controllers/user.controller')

router.post('/register' , [
     body('email').isEmail().withMessage('Invalid email'),
     body('fullname.firstname').isLength({min:3}).withMessage('First name must be at least 3 characters long'),
     body('password').isLength({min:6}).withMessage('Password must be minimum 6')
], registerUser)

router.post('/login' ,[
     body('email').isEmail().withMessage('Invalid email'),
     body('password').isLength({min:6}).withMessage('Password must be minimum 6')
], loginUser)

router.get('/profile', require('../middlewares/auth.middleware').authUser, require('../controllers/user.controller').getUserProfile)

router.post('/logout', require('../middlewares/auth.middleware').authUser, require('../controllers/user.controller').logoutUser)

router.get('/auth' ,require('../middlewares/auth.middleware').authUser , require('../controllers/user.controller').auth) 

module.exports = router