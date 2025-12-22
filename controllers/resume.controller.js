import mongoose from "mongoose";
import { getGridFSBucket } from "../config/gridfs.js";


export const uploadResume = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const gridFSBucket = getGridFSBucket();

    const uploadStream = gridFSBucket.openUploadStream(
      req.file.originalname,
      { contentType: req.file.mimetype }
    );

    const fileId = uploadStream.id;

    uploadStream.end(req.file.buffer);

    uploadStream.on("finish", () => {
      res.status(201).json({
        message: "Resume uploaded successfully",
        fileId 
      });
    });

    uploadStream.on("error", (err) => {
      console.error(err);
      res.status(500).json({ message: "Upload failed" });
    });

  } catch (error) {
    console.error(error.message);
    res.status(503).json({
      message: "Storage not ready. Try again."
    });
  }
};

// export const downloadResume = (req, res) => {
//   try {
//     const gridFSBucket = getGridFSBucket();

//     gridFSBucket
//       .openDownloadStream(new mongoose.Types.ObjectId(req.params.id))
//       .pipe(res);

//   } catch (error) {
//     res.status(503).json({ message: "Storage not ready" });
//   }
// };




// export const downloadResume = (req, res) => {
//   try {
//     const gridFSBucket = getGridFSBucket();
//     console.log("PARAMS:", req.params);

//     const { fileId } = req.params; // ✅ FIX HERE

//     console.log("FILE ID:", fileId);
//     console.log("Type:", typeof fileId);

//     // ✅ Validate ObjectId
//     if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
//       return res.status(400).json({ message: "Invalid file ID" });
//     }

//     const fileId = new mongoose.Types.ObjectId(req.params.id);

//     const downloadStream = gridFSBucket.openDownloadStream(fileId);

//     // ✅ IMPORTANT: handle errors
//     downloadStream.on("error", (err) => {
//       console.error("GridFS download error:", err.message);
//       return res.status(404).json({ message: "Resume not found" });
//     });

//     // Optional headers
//     res.set("Content-Type", "application/pdf");
//     res.set("Content-Disposition", "inline");

//     downloadStream.pipe(res);

//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ message: "Server error" });
//   }
// };




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
