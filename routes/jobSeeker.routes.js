import express from "express";
import {
  getAllJobs,
  getJobById,
  applyJob,
  myApplications,
  updateProfile
} from "../controllers/jobseeker.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/jobs", getAllJobs);
router.get("/jobs/:id", getJobById);

router.post("/apply", protect, applyJob);
router.get("/applications/my",protect,myApplications);
router.put("/profile", protect, updateProfile);

export default router;
