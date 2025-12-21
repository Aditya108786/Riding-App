
const express = require('express')
const router = express.Router()

const mapcontroller = require('../controllers/map.controller')



router.get('/coordinates' , mapcontroller.getcoordinate )
router.post('/distancetime' , mapcontroller.getdistancetime)
router.post('/getsuggestions' , mapcontroller.getsuggestions)
router.post('/getfulladdress' , mapcontroller.getfulladdress)

module.exports = router