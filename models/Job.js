import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
    {
        title: String,
        description: String,
        skills: [String],
        experience: String,
        salary: String,
        location: String,
        company: String,
        recruiter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        isBlocked: {
            type: Boolean,
            default: false
        },
        status: {
            type: String,
            enum: ["open", "closed", "paused"],
            default: "open",
        },

    },
    { timestamps: true }
)

export default mongoose.model('Job', jobSchema)