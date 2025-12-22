import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import { connectDB } from './config/db.js'
import authRoutes from './routes/auth.routes.js'
import jobRoutes from './routes/job.routes.js'
import applicationRoutes from './routes/application.routes.js'
import { initGridFS } from './config/gridfs.js'
import mongoose from 'mongoose'
import resumeRoutes from './routes/resume.routes.js'
import adminRoutes from './routes/admin.routes.js'
const app=express()
app.use(cors())
app.use(express.json())

await connectDB()
// mongoose.connection.once("open",()=>{
//     initGridFS()
// })
initGridFS();        

app.use('/api/auth',authRoutes)
app.use('/api/jobs',jobRoutes)
app.use('/api/apply',applicationRoutes)
app.use('/api/resume',resumeRoutes)
app.use('/api/admin',adminRoutes)

app.listen(process.env.PORT,()=>console.log(`Server is running on port ${[process.env.PORT]}`)
)