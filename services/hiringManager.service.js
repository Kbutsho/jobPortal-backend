const Job = require("../models/Job.model")

exports.hiringManagerJobsService = async (id) => {
    const job = await Job.find({ "hiringManager": id })
    return job
}
exports.hiringManagerJobByIdService = async(userId,jobId)=>{
   const job =  await Job.findOne({_id: jobId, "hiringManager": userId}).populate('appliedCandidate', '-appliedJob').populate('applicationId', '-name -address -candidateId -jobId -hiringManagerId')
   return job;
}