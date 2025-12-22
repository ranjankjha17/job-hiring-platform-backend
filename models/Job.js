import mongoose from "mongoose";

const jobSchema=new mongoose.Schema(
    {
        title:String,
        description:String,
        skills:[String],
        experience:String,
        salary:String,
        location:String,
        company:String,
        recruiter:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    },
    {timestamps:true}
)

export default mongoose.model('job',jobSchema)