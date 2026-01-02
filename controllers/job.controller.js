import Job from '../models/Job.js'
export const createJob=async (req,res)=>{
    const job=await Job.create({
        ...req.body,
        recruiter:req.user._id
    })

    res.json(job)
}

// export const getJobs=async (req,res)=>{
//     const jobs=await Job.find().sort({createdAt:-1})
//     res.json(jobs)
// }


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
