const Candidate = require("../models/Candidate.model")
const HiringManager = require("../models/HiringManager.model")

exports.getAllCandidateService = async ()=>{
    const candidate = await Candidate.find({})
    return candidate;
}
exports.getCandidateById = async (id)=>{
    const candidate = await Candidate.findById(id).populate('appliedJob', '-appliedCandidate -applicationId')
    return candidate;
}
exports.getAllManagerService = async ()=>{
    const result = await HiringManager.find({})
    return result;
}
