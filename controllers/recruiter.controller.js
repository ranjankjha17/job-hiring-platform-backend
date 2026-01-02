import { getGridFSBucket } from "../config/gridfs.js";
import Application from "../models/Application.js";
import Job from "../models/Job.js"

export const downloadApplicantResume = async (req, res) => {
  try {
    const { applicantId } = req.params;

    const applicant = await Application.findById(applicantId);

    if (!applicant) {
      return res.status(404).json({ message: "Applicant not found" });
    }

    const fileId = applicant.resumeFileId;

    const gridFSBucket = getGridFSBucket();

    const downloadStream = gridFSBucket.openDownloadStream(fileId);

    downloadStream.on("error", () => {
      return res.status(404).json({ message: "Resume not found" });
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline");

    downloadStream.pipe(res);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRecruiterStats = async (req, res) => {
  try {
    const recruiterId = req.user._id;

    // 1️⃣ Find recruiter's jobs
    const jobs = await Job.find({ recruiter: recruiterId }).select("_id");

    const jobIds = jobs.map(job => job._id);

    // 2️⃣ Total jobs
    const totalJobs = jobIds.length;

    // 3️⃣ Total applications
    const totalApplications = await Application.countDocuments({
      job: { $in: jobIds }
    });

    // 4️⃣ Applications by status
    const applicationsByStatus = await Application.aggregate([
      { $match: { job: { $in: jobIds } } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      totalJobs,
      totalApplications,
      applicationsByStatus
    });

  } catch (error) {
    console.error("Recruiter stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
