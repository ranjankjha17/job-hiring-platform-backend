import mongoose from "mongoose"
import Grid from "gridfs-stream"

let gfs

mongoose.connection.once("open", () => {
  gfs = Grid(mongoose.connection.db, mongoose.mongo)
  gfs.collection("uploads")
})

export const getFileById = async (req, res) => {
  try {
    const { fileId } = req.params
    console.log({fileId})

    if (!mongoose.Types.ObjectId.isValid(fileId)) {
      return res.status(400).json({ message: "Invalid fileId" })
    }

    const file = await gfs.files.findOne({
      _id: new mongoose.Types.ObjectId(fileId),
    })

    if (!file) {
      return res.status(404).json({ message: "File not found" })
    }

    res.set("Content-Type", file.contentType)

    const readStream = gfs.createReadStream(file._id)
    readStream.pipe(res)
  } catch (error) {
    console.error("Get file error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

