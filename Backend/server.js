
const app = require('./app')
const http = require('http')
const {initializesocket, sendmessagetosocketid} = require('./socket')

const port = process.env.PORT

const server = http.createServer(app)
initializesocket(server)

server.listen(port, ()=>{
    console.log(`Server running on port ${port}`)
})
