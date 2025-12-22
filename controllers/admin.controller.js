import User from "../models/User.js"
import Job from "../models/Job.js"
export const getStats = async (req, res) => {
    const users = await User.countDocuments()
    const jobs = await Job.countDocuments()
    const recruiters = await User.countDocuments({ role: "recruiter" })

    res.json({ users, jobs, recruiters })

}

export const getAllUsers=async(req,res)=>{
    const users=await User.find().select("-password")
    res.json(users)
}