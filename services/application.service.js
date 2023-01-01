const Application = require("../models/Application.model")
const Job = require("../models/Job.model")

exports.appliedJobService = async () => {
    return await Application.find({})
}
exports.appliedJobByCandidateService = async (userId) => {
    return await Application.find({ candidateId: userId })
}
exports.getAppByIdService = async (id) => {
    const result = await Application.findById(id).populate('jobId')
    return result
}
exports.appliedJobByManagerService = async (userId) => {
    return await Application.find({ hiringManagerId: userId })
}
exports.applicationUpdateService = async (id, data) => {
    const result = await Application.updateOne({ _id: id }, data, {
        runValidators: true
    });
    const application = await Application.findById(id)
    return { result, application }
}
exports.applicationDeleteService = async (id) => {

    const application = await Application.findById(id);
    const getJob = application.jobId
    const getCandidate = application.candidateId

    await Job.updateOne({ _id: getJob }, {
        $pullAll: {
            appliedCandidate: [{ _id: getCandidate }],
            applicationId: [{ _id: id }]
        },
    })
    const result = await Application.deleteOne({ _id: id });
    return result;
}
exports.getAllApplicationByJobService = async (jobId) => {
    return await Application.find({ jobId: jobId })
}