const jwt = require('jsonwebtoken');
const { hiringManagerJobsService, hiringManagerJobByIdService } = require('../services/hiringManager.service');

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