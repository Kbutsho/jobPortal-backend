const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const ManagerSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    userId: {
        type: ObjectId,
        required: true,
        ref: "User"
    },
    status: {
        type: String,
        default: "active",
        enum: ["active", "block"]
    },
    role: {
        type: String,
        default: "hiringManager"
    } 
}, {
    timestamps: true
})

const Manager = mongoose.model("HiringManager", ManagerSchema);
module.exports = Manager