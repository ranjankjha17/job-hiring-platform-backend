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
        resumeFileId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },

        status: {
            type: String,
            enum: ["applied", "shortlisted", "rejected"],
            default: "applied"
        },
        appliedAt: {
            type: Date,
            default: Date.now
        }

    },

    { timestamps: true }
)

export default mongoose.model('Application', applicationSchema)