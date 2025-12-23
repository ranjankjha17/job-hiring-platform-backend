import Application from '../models/Application.js'

import { getGridFSBucket } from "../config/gridfs.js";

export const applyJob = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Resume is required" });
    }

    const bucket = getGridFSBucket();

    const uploadStream = bucket.openUploadStream(
      req.file.originalname,
      {
        contentType: req.file.mimetype,
        metadata: {
          applicantId: req.user._id,
          jobId: req.params.jobId
        }
      }
    );

    uploadStream.end(req.file.buffer);

    uploadStream.on("finish", async () => {
      // ✅ THIS IS THE FIX
      const application = await Application.create({
        job: req.params.jobId,
        applicant: req.user._id,
        resumeFileId: uploadStream.id
      });

      res.status(201).json({
        message: "Job applied successfully",
        application
      });
    });

    uploadStream.on("error", (err) => {
      console.error("GridFS error:", err);
      res.status(500).json({ message: "Resume upload failed" });
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getApplicantsByJob = async (req, res) => {
    const applicants = await Application.find({ job: req.params.jobId })
        .populate("userId", "name email")
        .select("resumeFileId status appliedAt");

    res.json(applicants)
}


export const updateApplicationStatus = async (req, res) => {
    const { status } = req.body

    if (!["shortlisted", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" })
    }

    const application = await Application.findByIdAndUpdate(
        req.params.applicationId,
        { status },
        { new: true }
    )

    if (!application) {
        return res.status(404).json({ message: "Application not found" })
    }

    res.json(application)
}