const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const CandidateSchema = mongoose.Schema({
    userId: {
        type: ObjectId,
        required: true,
        ref: "User"
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "active",
        enum: ["active", "block"]
    },
    role: {
        type: String,
        default: "candidate"
    },
    appliedJob: [{
        type: ObjectId,
        ref: "Job"
    }]
}, {
    timestamps: true
})


const Candidate = mongoose.model("Candidate", CandidateSchema);
module.exports = Candidate