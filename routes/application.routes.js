import express from 'express'
import { applyJob, getApplicants, getApplicantsByJob, updateApplicationStatus } from '../controllers/application.controller.js'
import {protect} from '../middleware/auth.middleware.js'
import { authorize } from '../middleware/role.middleware.js'
import { upload } from '../utils/resumeUpload.js'

const router=express.Router()
router.post('/:jobId',protect,upload.single('resume'),applyJob)
router.get('/job/:jobId',protect,authorize('recruiter'),getApplicantsByJob)
// router.get('/job/:jobId/applicants',protect,authorize('recruiter'),getApplicantsByJob)

router.patch('/status/:applicationId',protect,authorize("recruiter"),updateApplicationStatus)

export default router