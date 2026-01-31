
const app = require('./app')
const http = require('http')
const {connectRedis} = require("./config/Redis")
const {initializesocket, sendmessagetosocketid} = require('./socket')

const port = process.env.PORT

const server = http.createServer(app)
 
(async()=>{
    try {
        await connectRedis()
        await initializesocket(server)
    }catch (err){
        console.error("Startup failed",err)
        process.exit(1)
    }
})()

server.listen(process.env.PORT || 5000 , ()=>{
     console.log("Server running on port 5000")
})