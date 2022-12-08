const Admin = require("../models/Admin.model")
const Candidate = require("../models/Candidate.model")
const Manager = require("../models/Manager.model")
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
    else if (role === 'manager') {
        await Manager.create(
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