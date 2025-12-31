import express from 'express'
import {getApplications,updateApplicationStatus} from '../controllers/applicant.controller.js'
import { protect } from '../middleware/auth.middleware.js'
import { authorize } from '../middleware/role.middleware.js'

const router=express.Router()

router.get('/',protect,authorize("recruiter","admin"),getApplications)
router.patch('/:id/status', protect, authorize("recruiter","admin"), updateApplicationStatus)


export default router