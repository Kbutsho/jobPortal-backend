const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const AdminSchema = mongoose.Schema({
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
        default: "admin"
    } 
}, {
    timestamps: true
})


const Admin = mongoose.model("Admin", AdminSchema);
module.exports = Admin