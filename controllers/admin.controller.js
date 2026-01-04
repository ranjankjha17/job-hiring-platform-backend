// import User from "../models/User.js"
// import Job from "../models/Job.js"
// import Application from "../models/Application.js";
// import { getGridFSBucket } from "../config/gridfs.js";

// export const getStats = async (req, res) => {
//     const users = await User.countDocuments()
//     const jobs = await Job.countDocuments()
//     const recruiters = await User.countDocuments({ role: "recruiter" })

//     res.json({ users, jobs, recruiters })

// }

// export const getAllUsers=async(req,res)=>{
//     const users=await User.find().select("-password")
//     res.json(users)
// }


import mongoose from "mongoose";
import User from "../models/User.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import { getGridFSBucket } from "../config/gridfs.js";

/* ================= DASHBOARD STATS ================= */
export const getStats = async (req, res) => {
  try {
    const users = await User.countDocuments();
    const jobs = await Job.countDocuments();
    const recruiters = await User.countDocuments({ role: "recruiter" });

    res.status(200).json({ users, jobs, recruiters });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch stats", error: error.message });
  }
};

/* ================= GET ALL USERS ================= */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users", error: error.message });
  }
};

// export const getAllJobs = async (req, res) => {
//   try {
//     const jobs = await Job.find().sort({ createdAt: -1 });
//     res.status(200).json(jobs);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to fetch jobs" });
//   }
// };


export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.aggregate([
      {
        $lookup: {
          from: "applications",           // collection name
          localField: "_id",               // Job._id
          foreignField: "job",             // Application.job
          as: "applications"
        }
      },
      {
        $addFields: {
          applicationCount: { $size: "$applications" }
        }
      },
      {
        $project: {
          applications: 0                 // hide full applications array
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]);

    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch jobs with application count",
      error: error.message
    });
  }
};



/* ================= JOB APPROVAL ================= */
export const approveJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json({ message: "Job approved" });
  } catch (error) {
    res.status(500).json({ message: "Failed to approve job", error: error.message });
  }
};

/* ================= BLOCK / UNBLOCK USER ================= */
export const toggleUserBlock = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.status(200).json({
      message: user.isBlocked ? "User blocked" : "User unblocked"
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update user status", error: error.message });
  }
};

/* ================= VIEW APPLICATIONS ================= */
export const getApplications = async (req, res) => {
  try {
    const apps = await Application.find()
      .populate("job")
      .populate("applicant", "name email");

    res.status(200).json(apps);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch applications", error: error.message });
  }
};

/* ================= DOWNLOAD RESUME ================= */
export const downloadResume = async (req, res) => {
  try {
    const bucket = getGridFSBucket();
    const fileId = new mongoose.Types.ObjectId(req.params.fileId);

    const downloadStream = bucket.openDownloadStream(fileId);

    downloadStream.on("error", () => {
      res.status(404).json({ message: "Resume not found" });
    });

    downloadStream.pipe(res);
  } catch (error) {
    res.status(500).json({ message: "Failed to download resume", error: error.message });
  }
};

/* ================= ADMIN ROLE MANAGEMENT ================= */
export const makeAdmin = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: "admin" },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User promoted to admin" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update role", error: error.message });
  }
};


export const updateJobStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { jobId } = req.params;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const job = await Job.findByIdAndUpdate(
      jobId,
      { status },
      { new: true }
    );

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json({
      message: "Job status updated successfully",
      job,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update job status",
      error: error.message,
    });
  }
};

/* ================= BLOCK / UNBLOCK JOB ================= */
export const toggleJobBlock = async (req, res) => {
  try {
    const { jobId } = req.params;
    console.log({jobId})
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    job.isBlocked = !job.isBlocked;
    await job.save();

    res.status(200).json({
      message: job.isBlocked
        ? "Job blocked successfully"
        : "Job unblocked successfully",
      job,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update job block status",
      error: error.message,
    });
  }
};



/* ================= UPDATE USER ROLE (ADMIN) ================= */
export const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    // Allowed roles (keep in sync with frontend Role type)
    const allowedRoles = ["admin", "recruiter", "jobseeker"];

    if (!role || !allowedRoles.includes(role)) {
      return res.status(400).json({
        message: "Invalid role provided",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User role updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update user role",
      error: error.message,
    });
  }
};



export const adminDashboard = async (req, res) => {
  try {
    const [
      totalUsers,
      totalJobs,
      totalApplications,
      open,
      closed,
      paused,
      appsByMonth,
    ] = await Promise.all([
      User.countDocuments(),
      Job.countDocuments(),
      Application.countDocuments(),
      Job.countDocuments({ status: "open" }),
      Job.countDocuments({ status: "closed" }),
      Job.countDocuments({ status: "paused" }),
      Application.aggregate([
        {
          $group: {
            _id: { $month: "$createdAt" },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id": 1 } },
      ]),
    ]);

    const months = [
      "", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    res.json({
      totalUsers,
      totalJobs,
      totalApplications,
      jobStatus: {
        open,
        closed,
        paused,
      },
      applicationsByMonth: appsByMonth.map((m) => ({
        month: months[m._id],
        count: m.count,
      })),
    });
  } catch (err) {
    res.status(500).json({ message: "Dashboard failed" });
  }
};
