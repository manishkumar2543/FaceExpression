const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const path = require('path') // 👈 add this

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use(cors({
    origin: [
        'http://localhost:5173',
         'https://face-expression-players.onrender.com'

    ],
    credentials: true
}))

// routes
const authRouter = require('./routes/auth.routes')
const songRouter = require('./routes/song.routes')

app.use('/api/auth', authRouter)
app.use('/api/songs', songRouter)


// 🔥 👇 YAHAN ADD KARNA HAI (IMPORTANT)

app.use(express.static(path.join(__dirname, '../public')))



// 👇 last me export
module.exports = app