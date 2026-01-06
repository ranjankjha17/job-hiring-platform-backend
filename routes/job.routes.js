import express from 'express'
import { createJob, getJobDetails, getJobs, getPublicJobs, isJobApplied } from '../controllers/job.controller.js'
import {protect} from '../middleware/auth.middleware.js'
import {authorize} from '../middleware/role.middleware.js'

const router=express.Router()
router.get('/public',getPublicJobs)
router.get("/public/:id", getJobDetails)
router.get('/',protect,authorize("recruiter"),getJobs)
router.post('/',protect,authorize("recruiter"),createJob)
router.get('/:jobId/is-applied',protect,isJobApplied)



export default router