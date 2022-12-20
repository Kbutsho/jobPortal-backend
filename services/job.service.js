
const Application = require("../models/Application.model");
const Job = require("../models/Job.model");
const Candidate = require("../models/Candidate.model");

exports.createJobService = async (data) => {
    const result = await Job.create(data)
    return result;
}
// {{URL}}/job?filter=salary,name,location,jobType&sort=salary&salary[gt]=25000
exports.getAllJobService = async (Data, queryData) => {
    const result = await Job.find(Data, '-appliedCandidate -applicationId')
        // .populate('hiringManager')
        .skip(queryData.skipByPage)
        .limit(queryData.limitByPage || queryData.limitBy)
        .select(queryData.filterBy)
        .sort(queryData.sortBy)

    //const totalJob = await Job.countDocuments(Data);
    //const totalPage = Math.ceil(totalJob / queryData.limitByPage || queryData.limitBy)
    return result
}
exports.getJobById = async (id) => {
    const result = await Job.findById(id, '-appliedCandidate -applicationId').populate('hiringManager');
    return result
}
exports.updateJobById = async (id, data) => {
    const result = await Job.updateOne({ _id: id }, data, {
        runValidators: true
    });
    const job = await Job.findById(id)
    return { result, job };
}
exports.applyJobService = async (id, data, userId) => {
    const getData = await Job.findById(id)
    function padTo2Digits(num) {
        return num.toString().padStart(2, '0');
    }
    function formatDate(date) {
        return [
            date.getFullYear(),
            padTo2Digits(date.getMonth() + 1),
            padTo2Digits(date.getDate()),
        ].join('-');
    }
    const getDate = new Date(formatDate(getData.deadline))
    const nowDate = new Date(formatDate(new Date()))
    if (getDate > nowDate) {
        let candidate = await Job.findOne({ _id: id }).select('appliedCandidate')
        const applied = candidate.appliedCandidate
        if (applied.length > 0) {
            let counter = 0;
            for (let i = 0; i < applied.length; i++) {
                if (applied[i].toString() === userId) {
                    let application = {
                        alreadyApplied: "already applied!"
                    }
                    return application;
                }
                else {
                    counter = counter + 1;
                }
            }
            if (counter === applied.length) {
                console.log("2");
                const applicationData = {
                    name: data.name,
                    email: data.email,
                    address: data.address,
                    resume: data.resume,
                    jobId: data.jobId,
                    hiringManagerId: getData.hiringManager,
                    candidateId: data.candidateId
                }
                let application = await Application.create(applicationData)
                const { _id: applicationId } = application
                //update job model 
                await Job.updateOne(
                    { _id: id },
                    { $push: { appliedCandidate: userId, applicationId: applicationId } }
                )
                await Candidate.updateOne(
                    { _id: userId },
                    { $push: { appliedJob: id } }
                )
                return application;
            }
        } else {
            const applicationData = {
                name: data.name,
                email: data.email,
                address: data.address,
                resume: data.resume,
                jobId: data.jobId,
                hiringManagerId: getData.hiringManager,
                candidateId: data.candidateId
            }
            let application = await Application.create(applicationData)
            const { _id: applicationId } = application
            //update job model 
            await Job.updateOne(
                { _id: id },
                { $push: { appliedCandidate: userId, applicationId: applicationId } }
            )
            await Candidate.updateOne(
                { _id: userId },
                { $push: { appliedJob: id } }
            )
            return application;
        }
    } else {
        return application = {
            deadlineOver: "deadline is over!"
        }
    }

}
exports.appliedJobService = async ()=>{
    return await Application.find({})
}
