import express from "express"
import multer from "multer"
import {
  getProfile,
  updateProfile,
  uploadResume
} from "../controllers/profile.controller.js"
import { protect } from "../middleware/auth.middleware.js"

const router = express.Router()
const upload = multer()

router.get("/", protect, getProfile)
router.put("/", protect, updateProfile)
router.post("/resume", protect, upload.single("resume"), uploadResume)

export default router
