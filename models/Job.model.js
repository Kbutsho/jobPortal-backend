const mongoose = require("mongoose")
const { ObjectId } = mongoose.Schema.Types;


const jobSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "job name is required!"],
        maxLength: [100, "job name field is too large!"],
        trim: true
    },
    "hiringManager": {
        type: ObjectId,
        required: [true, "Hiring manager id is required!"],
        ref: "HiringManager"
    },
    companyName: {
        type: String,
        required: [true, "company is required!"],
        maxLength: [100, "company name is too large!"]
    },
    companyDetails: {
        type: String,
        required: [true, "company details field is required!"],
        maxLength: [1000, "company details field is too large!"],
        trim: true
    },
    jobDescription: {
        type: String,
        required: [true, "job description field is required!"],
        maxLength: [1000, "job description field is too large!"],
        trim: true
    },
    jobResponsibilities: {
        type: String,
        required: [true, "job responsibilities field is required!"],
        maxLength: [1000, "job responsibilities field is too large!"],
        trim: true
    },

    additionalRequirements: {
        type: String,
        required: [true, "additional requirements is required!"]
    },
    salary: {
        required: true,
        type: Number
    },
    location: {
        required: [true, "job location is required!"],
        type: String,
        lowercase: true
    },
    jobType: {
        type: String,
        required: [true, "job type is required"],
        enum: {
            values: ["part-time", "full-time", "internship"],
            message: "{VALUE} can't be a job type!"
        }
    },
    vacancy: {
        type: Number,
        required: [true, "number of vacancy is required!"]
    },
    benefits: {
        type: String,
        required: [true, "benefits is required!"]
    },
    "appliedCandidate":[{
        type: ObjectId,
        ref: "Candidate"
    }],
    "applicationId":[{
        type: ObjectId,
        ref: "Application"
    }],
    Skills: {
        type: Array,
        required: [true, "skills is required!"]
    },
    deadline: {
        type: Date,
        required: [true, "job deadline is required!"]
    }
},
    {
        timestamps: true
    }
)
mongoose.Schema.Types.Array.checkRequired(v => Array.isArray(v) && v.length);
const Job = mongoose.model("Job", jobSchema)
module.exports = Job