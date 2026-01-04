import User from "../models/User.js"
import { getGridFSBucket } from "../config/gridfs.js"

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "name email profile resume"
    )

    res.json(user)
  } catch {
    res.status(500).json({ message: "Failed to fetch profile" })
  }
}

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, location, skills, experience } = req.body

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        name,
        profile: {
          phone,
          location,
          skills,
          experience
        }
      },
      { new: true }
    )

    res.json(user)
  } catch {
    res.status(500).json({ message: "Profile update failed" })
  }
}


export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Resume required" })
    }

    const bucket = getGridFSBucket()
    const uploadStream = bucket.openUploadStream(req.file.originalname)

    uploadStream.end(req.file.buffer)

    uploadStream.on("finish", async () => {
      await User.findByIdAndUpdate(req.user.id, {
        resumeFileId: uploadStream.id
      })

      res.json({ message: "Resume uploaded successfully" })
    })
  } catch (err) {
    res.status(500).json({ message: "Resume upload failed" })
  }
}
