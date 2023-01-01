const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const validator = require('validator');
const uniqueValidator = require('mongoose-unique-validator');

const applicationSchema = mongoose.Schema({
    "name": {
        required: [true, "your name is required!"],
        type: String,
    },
    email: {
        type: String,
        required: [true, "email is required!"]
    },
    coverLetter: {
        type: String,
        required: [true, "cover letter is required!"],
        maxLength: [2000, "cover letter not more than 2000 character!"]
    },
    "candidateId": {
        type: ObjectId,
        required: true,
        ref: "User"
    },
    "jobId": {
        type: ObjectId,
        required: true,
        ref: "Job"
    },
    "hiringManagerId": {
        type: ObjectId,
        required: true,
        ref: "User"
    },
    "status": {
        type: String,
        required: true,
        enum: {
            values: ["pending", "accept", "processing", "reject", "hired"],
            message: "{VALUE} can't be a job type!"
        },
        default: "pending"
    },
    "resume": {
        type: String,
        required: [true, "your resume is required!"],
    }
}, {
    timestamps: true
})
const Application = mongoose.model("Application", applicationSchema)
module.exports = Application;