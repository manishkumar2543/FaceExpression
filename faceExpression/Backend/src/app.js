const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const path = require('path')

const app = express()

app.use(express.json())
app.use(cookieParser())


app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.use(express.static('./public'))



// routes
const authRouter = require('./routes/auth.routes')
const songRouter = require('./routes/song.routes')

app.use('/api/auth', authRouter)
app.use('/api/songs', songRouter)


module.exports = app