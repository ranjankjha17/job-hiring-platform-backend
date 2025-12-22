import express from 'express'
import { protect } from '../middleware/auth.middleware.js'
import { upload } from '../utils/resumeUpload.js'
import {downloadResume, uploadResume } from '../controllers/resume.controller.js'
import { authorize } from '../middleware/role.middleware.js'

const router=express.Router()

router.post('/upload',protect,upload.single('resume'),uploadResume)

router.get('/download/:fileId',protect,authorize("recruiter","admin"),downloadResume)

export default router