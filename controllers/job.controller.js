const errorFormatter = require("../middleware/errorFormatter")
const {
    createJobService, getAllJobService, getJobById, updateJobById, applyJobService
} = require("../services/job.service")
const jwt = require('jsonwebtoken');
const Job = require("../models/Job.model");
const mongoose = require('mongoose');

exports.createJob = async (req, res) => {
    try {
        const data = await createJobService(req.body)
        res.json({
            status: 200,
            message: "job added successfully",
            data: data
        })
    } catch (error) {
        res.json({
            status: 400,
            message: "job added failed",
            data: errorFormatter(error.message)
        })
    }
}
exports.getJobs = async (req, res) => {
    try {

        let queryObject = { ...req.query }
        // exclude -> page, limit, sort
        const excludeFields = ["page", "limit", "sort"];
        excludeFields.forEach(field => delete queryObject[field]);

        let filterString = JSON.stringify(queryObject);
        filterString = filterString.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`)
        queryObject = JSON.parse(filterString);
        // queries
        const queries = {};
        if (req.query.page) {
            const { page = 1, limit = 5 } = req.query;
            const skip = (page - 1) * parseInt(limit);
            queries.skipByPage = skip;
            queries.limitByPage = parseInt(limit);
        }
        // limit data
        if (req.query.limit) {
            const limitBy = req.query.limit
            queries.limitBy = limitBy
        }
        // sort data
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            queries.sortBy = sortBy;
        }
        // filter data
        if (req.query.filter) {
            const filterBy = req.query.filter.split(',').join(' ');
            queries.filterBy = filterBy;
        }
        const result = await getAllJobService(queryObject, queries);
        res.json({
            "status": 200,
            "message": `job found ${result.length}`,
            "data": result
        })
    } catch (error) {
        res.json({
            "status": 400,
            "message": `failed`,
            "error": error.message
        })
    }
}
exports.getJobById = async (req, res) => {
    const { id } = req.params
    try {
        const job = await getJobById(id);
        if (!job) {
            return res.json({
                status: 400,
                message: `${id} not found`,
                error: "invalid job id"
            })
        }
        res.json({
            status: 200,
            message: `job id ${id}`,
            data: job
        })
    } catch (error) {
        res.json({
            status: 400,
            message: `${id} is not a valid id`,
            error: "invalid job id"
        })
    }
}
exports.updateJob = async (req, res) => {
    try {
        const { id } = req.params;
        const { result, job } = await updateJobById(id, req.body);
        if (!result) {
            return res.json({
                status: 400,
                "message": "failed",
                "error": "job is upto date!"
            })
        }
        res.json({
            status: 200,
            "message": "job update successful",
            "data": job
        })
    } catch (error) {
        res.json({
            status: 400,
            "message": "failed",
            "error": error.message
        })
    }
}
exports.applyJob = async (req, res) => {
    const { id } = req.params
    const validId = mongoose.Types.ObjectId.isValid(id);
    if (validId) {
        const job = await Job.findById(id).select('_id').lean();
        if (job) {
            try {
                const { authorization } = req.headers
                const token = authorization.split(' ')[1]
                const { id: userId } = jwt.verify(token, process.env.TOKEN_SECRET);
                const jobData = {
                    name: req.body.name,
                    address: req.body.address,
                    resume: req.body.resume,
                    jobId: id,
                    candidateId: userId
                }
                const application = await applyJobService(id, jobData, userId)
                if (application.deadlineOver) {
                    return res.json({
                        "status": 400,
                        "message": "failed!",
                        error: "deadline is over!"
                    })
                }
                if(application.alreadyApplied){
                    return res.json({
                        "status": 400,
                        "message": "failed!",
                        error: "you have already applied!"
                    })
                }
                res.json({
                    "status": 200,
                    "message": "application successful!",
                    "data": application
                })
            } catch (error) {
                res.json({
                    "status": 400,
                    "message": "failed!",
                    error: (error.message)
                })
            }
        } else {
            res.json({
                "status": 400,
                "message": "job not found!",
                "error": `${id} is not a valid job id!`
            })
        }
    } else {
        res.json({
            "status": 400,
            "message": "job not found!",
            "error": `${id} is not a valid object id!`
        })
    }
}

