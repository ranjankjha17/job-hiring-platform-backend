// import express from 'express'
// import { getAllUsers, getStats } from '../controllers/admin.controller.js'
// import {protect} from "../middleware/auth.middleware.js"
// import {authorize} from "../middleware/role.middleware.js"
// const router=express.Router()

// router.get("/stats",protect,authorize("admin"),getStats)
// router.get("/users",protect,authorize("admin"),getAllUsers)

// export default router



import express from "express";
import {protect} from "../middleware/auth.middleware.js"
import {authorize} from "../middleware/role.middleware.js"

import {
  getStats,
  getAllUsers,
  approveJob,
  toggleUserBlock,
  getApplications,
  downloadResume,
  makeAdmin,
  getAllJobs,
  updateJobStatus,
  toggleJobBlock,
  updateUserRole,
  adminDashboard
} from "../controllers/admin.controller.js";

const router = express.Router();

/* ================= DASHBOARD ================= */
router.get("/stats", protect, authorize("admin"), getStats);
router.get("/users", protect, authorize("admin"), getAllUsers);
router.get("/jobs", protect, authorize("admin"), getAllJobs);

/* ================= ADMIN ACTIONS ================= */
router.put("/jobs/:id/approve", protect, authorize("admin"), approveJob);
router.patch("/users/:id/block", protect, authorize("admin"), toggleUserBlock);
router.get("/applications", protect, authorize("admin"), getApplications);
router.get("/resume/:fileId", protect, authorize("admin"), downloadResume);
router.put("/users/:id/make-admin", protect, authorize("admin"), makeAdmin);
router.patch("/jobs/:jobId/status", protect, authorize("admin"), updateJobStatus);
router.patch("/jobs/:jobId/block", protect, authorize("admin"), toggleJobBlock);
router.patch("/users/:userId/role",protect, authorize("admin"), updateUserRole);
router.get("/dashboard", protect, authorize("admin"), adminDashboard);

export default router;
