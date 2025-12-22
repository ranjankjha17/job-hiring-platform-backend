import Application from '../models/Application.js'
export const applyJob = async (req, res) => {
    const application = await Application.create({
        job: req.params.jobId,
        applicant: req.user._id
    })

    res.json(application)
}


export const getApplicantsByJob = async (req, res) => {
    const applications = await Application.find({ job: req.params.jobId })
        .populate("applicant", "name email resume")

    res.json(applications)
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