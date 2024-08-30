import { config } from 'dotenv'
import express from 'express'
import cors from 'cors'
import connectDB from './db/connect.js'
import userRoute from './routes/user.route.js'
import authRoute from './routes/auth.route.js'
import { errorResponse } from './utils/error.js'
import cookieParser from 'cookie-parser'
import postRoute from './routes/post.route.js'
import commentRoute from './routes/comment.route.js'

config()

const app = express() 
const PORT = process.env.PORT || 3000
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'

app.use(cors({
  origin: CLIENT_URL,
  credentials: true
}))
app.use(cookieParser())
app.use(express.json()) 
app.use(express.urlencoded({ extended: true }))
connectDB()

app.use( "/api/user", userRoute)
app.use("/api/auth", authRoute)
app.use("/api/post", postRoute)
app.use("/api/comment", commentRoute)

app.use(errorResponse)


app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})
