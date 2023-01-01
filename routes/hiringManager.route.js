const express = require('express');
const { getApplicationByManager, getApplicationByJob, getAppDetailsById, deleteApplication } = require('../controllers/Application.Controller');
const { hiringManagerJobs, hiringManagerJobById, updateManagerApplicationById } = require('../controllers/hiringManager.controller');
const authentication = require('../middleware/authentication');
const authorization = require('../middleware/authorization');
const managerRouter = express.Router();

managerRouter.route('/jobs')
.get(authentication, authorization("hiringManager"),hiringManagerJobs)

managerRouter.route('/application')
.get(authentication, authorization("hiringManager"),getApplicationByManager)

managerRouter.route("/application/:id")
.get(authentication, authorization("hiringManager"),getAppDetailsById)
.patch(authentication, authorization("hiringManager"),updateManagerApplicationById)
.delete(authentication, authorization("hiringManager"),deleteApplication)

managerRouter.route('/job/:id/applications')
.get(authentication, authorization("hiringManager"),getApplicationByJob)

managerRouter.route('/jobs/:id')
.get(authentication, authorization("hiringManager"),hiringManagerJobById)

module.exports = managerRouter