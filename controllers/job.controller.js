import Application from '../models/Application.js'
import Job from '../models/Job.js'
export const createJob=async (req,res)=>{
    const job=await Job.create({
        ...req.body,
        recruiter:req.user._id
    })

    res.json(job)
}


export const getPublicJobs = async (req, res) => {
  try {
    const { q, location, type } = req.query

    const filter= {
      status: 'open',
      isBlocked: false
    }

    // 🔍 Search by title or company
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { company: { $regex: q, $options: "i" } }
      ]
    }

    // 🌍 Location filter
    if (location) {
      filter.location = location
    }

    // 💼 Job type filter
    if (type) {
      filter.type = type
    }

    const jobs = await Job.find(filter)
      .sort({ createdAt: -1 })
      .select(
        "title company location type salary createdAt"
      )

    res.status(200).json(jobs)
  } catch (error) {
    console.error("GET PUBLIC JOBS ERROR:", error)

    res.status(500).json({
      message: "Failed to fetch jobs"
    })
  }
}

export const getJobDetails = async (req, res) => {
  try {
    const { id } = req.params

    const job = await Job.findOne({
      _id: id,
      status:'open',
      isBlocked: false
    }).populate("company", "name logo")

    if (!job) {
      return res.status(404).json({ message: "Job not found" })
    }
// console.log(res.json(job))
    res.json(job)
  } catch (error) {
    console.error("GET JOB DETAILS ERROR:", error)
    res.status(500).json({ message: "Failed to load job" })
  }
}

export const getJobs = async (req, res) => {
  try {
    const userId = req.user._id
    const role = req.user.role

    let filter = {}

    // ✅ Recruiter: only their jobs
    if (role === "recruiter") {
      filter.recruiter = userId
    }

    // ✅ Admin: sees all jobs (no filter)
    // ✅ Jobseeker: usually sees all jobs (optionally add status later)

    const jobs = await Job.find(filter).sort({ createdAt: -1 })

    res.status(200).json(jobs)
  } catch (error) {
    console.error("Get jobs error:", error)
    res.status(500).json({ message: "Server error" })
  }
}


export const isJobApplied = async (req, res) => {
  const userId = req.user.id
  const { jobId } = req.params

  const application = await Application.findOne({
    job: jobId,
    applicant: userId
  })

  res.json({ applied: !!application })
}
