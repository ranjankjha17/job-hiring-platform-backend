import { getGridFSBucket } from "../config/gridfs.js";
import Application from "../models/Application.js";

export const downloadApplicantResume = async (req, res) => {
  try {
    const { applicantId } = req.params;

    const applicant = await Application.findById(applicantId);

    if (!applicant) {
      return res.status(404).json({ message: "Applicant not found" });
    }

    const fileId = applicant.resumeFileId;

    const gridFSBucket = getGridFSBucket();

    const downloadStream = gridFSBucket.openDownloadStream(fileId);

    downloadStream.on("error", () => {
      return res.status(404).json({ message: "Resume not found" });
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline");

    downloadStream.pipe(res);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
