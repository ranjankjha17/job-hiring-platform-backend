import Job from '../models/Job.js'
export const createJob=async (req,res)=>{
    const job=await Job.create({
        ...req.body,
        recruiter:req.user._id
    })

    res.json(job)
}

export const getJobs=async (req,res)=>{
    const jobs=await Job.find().sort({createdAt:-1})
    res.json(jobs)
}