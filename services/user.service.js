const Admin = require("../models/Admin.model")
const Candidate = require("../models/Candidate.model")
const HiringManager = require("../models/HiringManager.model")
const User = require("../models/User.model")

exports.signupService = async (data) => {
    const result = await User.create(data)
    const { _id: userId, name, email, role } = result
    if (role === 'candidate') {
        await Candidate.create(
            { name, userId, email }
        )
        return result;
    }
    else if (role === 'hiringManager') {
        await HiringManager.create(
            { name, userId, email }
        )
        return result;
    }
    else if (role === 'admin') {
        await Admin.create(
            { name, userId, email }
        )
        return result;
    }

}
exports.findUserByEmail = async (email) => {
    const credential = await User.findOne({ email })
    return credential;
}