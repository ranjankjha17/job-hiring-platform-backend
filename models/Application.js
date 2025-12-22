import mongoose from "mongoose";

const applicationSchema = mongoose.Schema(
    {
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Job'
        },
        applicant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        status: {
            type: String,
            enum: ["applied", "shortlisted", "rejected"],
            default: "applied"
        }
    },
    { timestamps: true }
)

export default mongoose.model('Application',applicationSchema)