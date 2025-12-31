import express from 'express'
import { getFileById } from '../controllers/fileController.js'
import { protect } from '../middleware/auth.middleware.js'
import { downloadResume } from '../controllers/resume.controller.js'
import { authorize } from '../middleware/role.middleware.js'

const router = express.Router()

router.get('/:fileId', downloadResume)

export default router
