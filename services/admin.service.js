const User = require("../models/User.model");
exports.getAllCandidateService = async ()=>{
    const candidate = await User.find({})
    return candidate;
}
exports.getCandidateById = async (id)=>{
    const candidate = await User.findById(id).populate('appliedJob', '-appliedCandidate -applicationId')
    return candidate;
}
exports.getAllManagerService = async ()=>{
    const result = await User.find({})
    return result;
}
