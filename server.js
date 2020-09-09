const express = require('express')
const cors = require('cors')
const hubsRouter = require('./posts/posts-router.js')
const server = express()

server.use(express.json())
server.use(cors())

server.use('/api/posts', hubsRouter)



server.get("/", (req, res) => {
    res.send(`
    <div>
        <h2>Lambda Hub API</h2>
        <p>Welcome to the Lambda Posts API</p>
        <p>Created by: BkAngel201</p>
    </div>
    `)
})


module.exports = server