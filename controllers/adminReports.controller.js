import User from '../models/User.js'
import Job from '../models/Job.js'
import Application from '../models/Application.js'

export const adminReports = async (req, res) => {
  try {
    const [
      totalUsers,
      blockedUsers,
      totalJobs,
      openJobs,
      closedJobs,
      pausedJobs,
      totalApplications,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isBlocked: true }),
      Job.countDocuments(),
      Job.countDocuments({ status: "open" }),
      Job.countDocuments({ status: "closed" }),
      Job.countDocuments({ status: "paused" }),
      Application.countDocuments(),
    ]);

    res.json({
      totalUsers,
      blockedUsers,
      totalJobs,
      openJobs,
      closedJobs,
      pausedJobs,
      totalApplications,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to load reports" });
  }
};
