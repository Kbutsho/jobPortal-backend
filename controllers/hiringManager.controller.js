const jwt = require('jsonwebtoken');
const { hiringManagerJobsService, hiringManagerJobByIdService, applicationUpdateByManagerService } = require('../services/hiringManager.service');
const mongoose = require('mongoose');
const Application = require('../models/Application.model');
const errorFormatter = require('../middleware/errorFormatter');

exports.hiringManagerJobs = async (req, res) => {
    let token
    const { authorization } = req.headers
    if (authorization && authorization.startsWith('Bearer')) {
        try {
            token = authorization.split(' ')[1]
            const { id } = jwt.verify(token, process.env.TOKEN_SECRET)
            const job = await hiringManagerJobsService(id);
            res.json({
                status: 200,
                "message": `job found ${job.length}`,
                data: job
            })

        } catch (error) {
            res.json({
                status: 400,
                "message": "not found",
                error: error
            })
        }
    }
    if (!token) {
        res.status(401).send({ "status": "failed", "message": "Unauthorized User, No Token" })
    }
}
exports.hiringManagerJobById = async (req, res) => {
    try {
        const { authorization } = req.headers
        const { id: jobId } = req.params
        const token = authorization.split(' ')[1]
        const { id: userId } = jwt.verify(token, process.env.TOKEN_SECRET);
        const job = await hiringManagerJobByIdService(userId, jobId);
        if (!job) {
           return res.json({
                status: 400,
                message: "no job found"
            })
        }
         res.json({
            status: 200,
            message: "job details",
            data: job
        })
    } catch (error) {
        res.json({
            status: 400,
            error: error.message
        })
    }


}
exports.updateManagerApplicationById = async (req, res) => {
    const { id } = req.params;
    const validId = mongoose.Types.ObjectId.isValid(id);
    if (validId) {
        const app = await Application.findById(id).select('_id').lean();
        if (app) {
            try {
                const {result,app} = await applicationUpdateByManagerService(id, req.body);
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
                    data: app
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