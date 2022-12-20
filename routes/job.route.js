const express = require('express');
const {
    createJob, getJobs, getJobById, updateJob, applyJob, getAppliedJob
}
    = require('../controllers/job.controller');
const authorization = require('../middleware/authorization');
const authentication = require("../middleware/authentication");
const upload = require('../middleware/fileUpload');
const jobRouter = express.Router();

jobRouter.route('/')
    .post(authentication, authorization("hiringManager"), createJob)
    .get(getJobs)

jobRouter.route('/application').get(getAppliedJob)
jobRouter.route('/:id/apply')
    .post(authentication, authorization("candidate"), upload.single('resume'), applyJob)

jobRouter.route('/:id')
    .get(getJobById)
    .patch(updateJob)



module.exports = jobRouter