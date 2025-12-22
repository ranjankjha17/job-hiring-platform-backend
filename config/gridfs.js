import mongoose from "mongoose";

let gridFSBucket = null;

export const initGridFS = () => {
  if (gridFSBucket) return; 

  gridFSBucket = new mongoose.mongo.GridFSBucket(
    mongoose.connection.db,
    { bucketName: "resumes" }
  );

  console.log("✅ GridFSBucket initialized");
};

export const getGridFSBucket = () => {
  if (!gridFSBucket) {
    throw new Error("GridFSBucket not initialized");
  }
  return gridFSBucket;
};

