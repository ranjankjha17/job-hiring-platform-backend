import express from 'express'
import { applyJob, getApplicantsByJob, updateApplicationStatus } from '../controllers/application.controller.js'
import {protect} from '../middleware/auth.middleware.js'
import { authorize } from '../middleware/role.middleware.js'

const router=express.Router()
router.post('/:jobId',protect,applyJob)
router.get('/job/:jobId',protect,authorize('recruiter'),getApplicantsByJob)
router.patch('/status/:applicationId',protect,authorize("recruiter"),updateApplicationStatus)

export default router