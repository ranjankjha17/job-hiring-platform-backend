import mongoose from "mongoose"
import Application from "../models/Application.js"

export const getApplications = async (req, res) => {
    try {
        const { jobId } = req.query

        const filter = {}

        if (jobId) {
            if (!mongoose.Types.ObjectId.isValid(jobId)) {
                return res.status(400).json({ message: "Invalid jobId" })
            }
            filter.job = jobId
        }

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
        console.log({ id, status })
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
