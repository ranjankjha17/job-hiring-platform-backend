import Job from "../models/Job.js";
import Application from "../models/Application.js";
import User from "../models/User.js";
import mongoose from "mongoose";

/**
 * GET /job-seeker/jobs
 */
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
};

/**
 * GET /job-seeker/jobs/:id
 */
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    res.json(job);
  } catch {
    res.status(404).json({ message: "Job not found" });
  }
};

/**
 * POST /job-seeker/apply
 */
// export const applyJob = async (req, res) => {
//   try {
//     const { jobId, resumeFileId } = req.body;
//     console.log(jobId,resumeFileId)

//     const exists = await Application.findOne({
//       job: jobId,
//       applicant: req.user.id
//     });

//     if (exists) {
//       return res.status(400).json({ message: "Already applied" });
//     }

//     const application = await Application.create({
//       job: jobId,
//       applicant: req.user.id,
//       resumeFileId
//     });

//     res.status(201).json(application);
//   } catch (error) {
//     console.error("APPLY JOB ERROR:", error);
//     res.status(500).json({ message: "Application failed" });
//   }
// };


export const applyJob = async (req, res) => {
  try {
    const { jobId, resumeFileId } = req.body;

    if (!jobId) {
      return res.status(400).json({ message: "Job ID is required" });
    }

    // 🔒 Prevent duplicate apply
    const exists = await Application.findOne({
      job: jobId,
      applicant: req.user.id
    });

    if (exists) {
      return res.status(400).json({ message: "Already applied" });
    }

    let finalResumeId = resumeFileId;

    // 🧠 If resume not sent, get it from user profile
    if (!finalResumeId) {
      const user = await User.findById(req.user.id).select("resumeFileId");

      if (!user || !user.resumeFileId) {
        return res.status(400).json({
          message: "Resume not found. Please upload resume first."
        });
      }

      finalResumeId = user.resumeFileId;
    }

    const application = await Application.create({
      job: jobId,
      applicant: req.user.id,
      resumeFileId: finalResumeId
    });

    res.status(201).json({
      message: "Job applied successfully",
      application
    });

  } catch (error) {
    console.error("APPLY JOB ERROR:", error);

    // 🔐 Duplicate index safety
    if (error.code === 11000) {
      return res.status(400).json({ message: "Already applied" });
    }

    res.status(500).json({ message: "Application failed" });
  }
};


/**
 * GET /job-seeker/applications
 */


export const myApplications = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const apps = await Application.find({
      applicant: userId // ✅ FIXED
    }).populate("job");

    res.status(200).json(apps);
  } catch (error) {
    console.error("APPLICATION FETCH ERROR:", error);
    res.status(500).json({ message: "Failed to load applications" });
  }
};

/**
 * PUT /job-seeker/profile
 */
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      req.body,
      { new: true }
    );
    res.json(user);
  } catch {
    res.status(500).json({ message: "Profile update failed" });
  }
};
