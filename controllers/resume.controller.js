import mongoose from "mongoose";
import { getGridFSBucket } from "../config/gridfs.js";
import User from "../models/User.js";

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" })
    }

    const bucket = getGridFSBucket()

    const uploadStream = bucket.openUploadStream(
      req.file.originalname,
      { contentType: req.file.mimetype }
    )

    uploadStream.end(req.file.buffer)

    uploadStream.on("finish", async () => {
      // ✅ SAVE CORRECT GridFS FILE ID
      const user = await User.findByIdAndUpdate(
        req.user.id,
        { resume: uploadStream.id },
        { new: true }
      )

      res.status(201).json({
        message: "Resume uploaded successfully",
        resumeId: uploadStream.id,
        user
      })
    })

    uploadStream.on("error", (err) => {
      console.error("GRIDFS ERROR:", err)
      res.status(500).json({ message: "Upload failed" })
    })

  } catch (error) {
    console.error("UPLOAD RESUME ERROR:", error)
    res.status(503).json({
      message: "Storage not ready. Try again."
    })
  }
}


export const downloadResume = (req, res) => {
  try {
    const gridFSBucket = getGridFSBucket();

    console.log("PARAMS:", req.params);

    const { fileId } = req.params; // ✅ correct

    console.log("FILE ID:", fileId);
    console.log("Type:", typeof fileId);

    // ✅ Validate ObjectId
    if (!fileId || !mongoose.Types.ObjectId.isValid(fileId)) {
      return res.status(400).json({ message: "Invalid file ID" });
    }

    const objectId = new mongoose.Types.ObjectId(fileId);

    const downloadStream = gridFSBucket.openDownloadStream(objectId);

    // ✅ Handle file not found
    downloadStream.on("error", (err) => {
      console.error("GridFS download error:", err.message);
      return res.status(404).json({ message: "Resume not found" });
    });

    // Optional headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline");

    downloadStream.pipe(res);

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};
