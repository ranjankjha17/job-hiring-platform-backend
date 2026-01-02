import express from 'express'
import { downloadResume } from '../controllers/resume.controller.js'

const router = express.Router()

router.get('/:fileId',downloadResume)

export default router
