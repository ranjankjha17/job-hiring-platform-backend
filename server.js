import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import { connectDB } from './config/db.js'
import authRoutes from './routes/auth.routes.js'
import jobRoutes from './routes/job.routes.js'
import applicationRoutes from './routes/application.routes.js'
import { initGridFS } from './config/gridfs.js'
import resumeRoutes from './routes/resume.routes.js'
import adminRoutes from './routes/admin.routes.js'
import recruiterRoutes from './routes/recruiter.routes.js'
import applicantRoutes from './routes/applicant.routes.js'
import fileRoutes from './routes/fileRoutes.js'
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
app.use('/api/recruiter',recruiterRoutes)
app.use('/api/applicants',applicantRoutes)
app.use("/api/files", fileRoutes)


app.listen(process.env.PORT,()=>console.log(`Server is running on port ${[process.env.PORT]}`)
)