import mongoose from "mongoose"
import Application from "../models/Application.js"
import Job from '../models/Job.js'


export const getApplications = async (req, res) => {
  try {
    const { jobId } = req.query
    const userId = req.user._id
    const role = req.user.role

    const filter = {}

    // ✅ Validate jobId if provided
    if (jobId) {
      if (!mongoose.Types.ObjectId.isValid(jobId)) {
        return res.status(400).json({ message: "Invalid jobId" })
      }
      filter.job = jobId
    }

    // ✅ Recruiter: ONLY applications for their jobs
    if (role === "recruiter") {
      const jobs = await Job.find({ recruiter: userId }).select("_id")
      const jobIds = jobs.map(job => job._id)

      filter.job = filter.job
        ? filter.job
        : { $in: jobIds }
    }

    // ✅ Jobseeker: ONLY their applications
    if (role === "jobseeker") {
      filter.applicant = userId
    }

    // ✅ Admin: no restriction (see all)

    const applications = await Application.find(filter)
      .populate("applicant", "name email")
      .populate("job", "title company")
      .sort({ createdAt: -1 })

    res.status(200).json(applications)
  } catch (error) {
    console.error("Get applications error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

export const updateApplicationStatus = async (req, res) => {
    try {
        const { id } = req.params
        const { status } = req.body
        // console.log({ id, status })
        if (!status) {
            return res.status(400).json({
                success: false,
                message: "Status is required",
            })
        }

        if (!["applied", "shortlisted", "rejected"].includes(status.charAt(0).toLowerCase() + status.slice(1))) {
            return res.status(400).json({
                success: false,
                message: "Invalid status value",
            })
        }

        const application = await Application.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        )

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found",
            })
        }

        res.json({
            success: true,
            data: application,
            message: "Status updated successfully",
        })
    } catch (error) {
        console.error("Update status error:", error)
        res.status(500).json({
            success: false,
            message: "Server error",
        })
    }
}
