import express from 'express'
import { protect } from '../middleware/auth.middleware.js'
import { authorize } from '../middleware/role.middleware.js'
import { downloadApplicantResume, getApplicants } from '../controllers/recruiter.controller.js'
import { getApplicantsByJob } from '../controllers/application.controller.js'

const router=express.Router()

router.get('/applicants',getApplicants)

router.get('/applicants/:applicantId/resume',protect,authorize("recruiter","admin"),downloadApplicantResume)

router.get('/jobs/:jobId/applicants',protect,authorize("recruiter","admin"),getApplicantsByJob)

export default router