import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: String,
        email: { type: String, unique: true },
        password: String,
        role: {
            type: String,
            enum: ["jobseeker", "recruiter", "admin"],
            default: "jobseeker"
        },
        profile: {
            phone: String,
            location: String,
            skills: [String],
            experience: String
        },

        isBlocked: {
            type: Boolean,
            default: false
        },

        resume: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "resumes.files"
        }
    },
    { timestamps: true }
)

export default mongoose.model("User", userSchema)