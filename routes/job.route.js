const express = require('express');
const {
    createJob, getJobs, getJobById, updateJob, applyJob
}
    = require('../controllers/job.controller');
const authorization = require('../middleware/authorization');
const authentication = require("../middleware/authentication");
const jobRouter = express.Router();

jobRouter.route('/')
    .post(authentication, authorization("hiringManager"), createJob)
    .get(getJobs)

jobRouter.route('/:id/apply')
    .post(authentication, authorization("candidate"), applyJob) 

jobRouter.route('/:id')
.get(getJobById)
.patch(updateJob)

module.exports = jobRouter