const errorFormatter = require("../middleware/errorFormatter")
const { appliedJobService, appliedJobByCandidateService, appliedJobByManagerService, getAppByIdService, applicationUpdateService, applicationDeleteService, getAllApplicationByJobService } = require("../services/application.service")
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Application = require("../models/Application.model");
const Job = require("../models/Job.model");

exports.getAppliedJob = async (req, res) => {
    const data = await appliedJobService()
    res.json({
        "total application": data.length,
        data: data
    })
}
exports.getApplicationByCandidate = async (req, res) => {
    try {
        const { authorization } = req.headers
        const token = authorization.split(' ')[1]
        const { id: userId } = jwt.verify(token, process.env.TOKEN_SECRET);
        const data = await appliedJobByCandidateService(userId)
        res.json({
            status: 200,
            message: `total application ${data.length}`,
            data: data
        })
    } catch (error) {
        res.json({
            error: errorFormatter(error.message)
        })
    }
}
exports.getApplicationByManager = async (req, res) => {
    try {
        const { authorization } = req.headers
        const token = authorization.split(' ')[1]
        const { id: userId } = jwt.verify(token, process.env.TOKEN_SECRET);
        const data = await appliedJobByManagerService(userId)
        res.json({
            status: 200,
            message: `total application ${data.length}`,
            data: data
        })
    } catch (error) {
        res.json({
            error: errorFormatter(error.message)
        })
    }
}
exports.getAppDetailsById = async (req, res) => {
    const { id } = req.params
    try {
        const job = await getAppByIdService(id);
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
exports.updateApplicationById = async (req, res) => {
    const { id } = req.params;
    const validId = mongoose.Types.ObjectId.isValid(id);
    if (validId) {
        const app = await Application.findById(id).select('_id').lean();
        if (app) {
            try {
                const { result, application } = await applicationUpdateService(id, req.body);
                if (!result) {
                    return res.json({
                        status: 400,
                        "message": "failed",
                        "error": "application is upto date!"
                    })
                }
                res.json({
                    status: 200,
                    "message": "application update successful!",
                    result: application
                })
                // if (!result) {
                //     return res.json({
                //         status: 400,
                //         "message": "failed",
                //         "error": "application is upto date!"
                //     })
                // }
                // if (result) {
                //     return res.json({
                //         status: 200,
                //         "message": "application update successful!",
                //         result: result
                //     })
                //}
            } catch (error) {
                res.json({
                    "status": 400,
                    "message": "failed!",
                    error: errorFormatter(error.message)
                })
            }
        } else {
            res.json({
                "status": 400,
                "message": "application not found!",
                "error": `${id} is not a valid application id!`
            })
        }
    } else {
        res.json({
            "status": 400,
            "message": "application not found!",
            "error": `${id} is not a valid object id!`
        })
    }
}
exports.deleteApplication = async ( req, res) =>{
    try {
        const {id} = req.params; 
       await applicationDeleteService(id);
        res.json({
            "message" : "application delete successfully!"
        })
    } catch (error) {
        res.json({
            "message" : "failed",
            error: error.message
        })
    }
}
exports.getApplicationByJob = async (req,res) =>{
    const { id } = req.params;
    const validId = mongoose.Types.ObjectId.isValid(id);
    if (validId) {
        const job = await Job.findById(id).select('_id').lean();
        if (job) {
            try {
                const  application = await getAllApplicationByJobService(id);
                res.json({
                    status: 200,
                    "message": `application found ${application.length}`,
                    data: application
                })
            } catch (error) {
                res.json({
                    "status": 400,
                    "message": "failed!",
                    error: errorFormatter(error.message)
                })
            }
        } else {
            res.json({
                "status": 400,
                "message": "Job not found!",
                "error": `${id} is not a valid job id!`
            })
        }
    } else {
        res.json({
            "status": 400,
            "message": "Job not found!",
            "error": `${id} is not a valid object id!`
        })
    }
}

