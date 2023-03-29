const express = require('express')
require('express-async-errors')

const app = express()
const errorHandler = require('./src/middleware/errorHandler')
const chatgptRouter = require('./src/routes/chat-gpt')

app.use(express.json())

app.use('/api/chat-gpt', chatgptRouter)

app.use(errorHandler)

module.exports = app