import express from 'express'
import {protect} from "../middleware/auth.middleware.js"
import {authorize} from "../middleware/role.middleware.js"
import { adminReports } from '../controllers/adminreports.controller.js'
const router=express.Router()

router.get('/',protect, authorize("admin"),adminReports)

export default router

