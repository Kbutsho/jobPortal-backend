const express = require('express');
const { hiringManagerJobs, hiringManagerJobById } = require('../controllers/hiringManager.controller');
const authentication = require('../middleware/authentication');
const authorization = require('../middleware/authorization');
const managerRouter = express.Router();

managerRouter.route('/jobs')
.get(authentication, authorization("hiringManager", "admin"),hiringManagerJobs)

managerRouter.route('/jobs/:id')
.get(authentication, authorization("hiringManager", "admin"),hiringManagerJobById)

module.exports = managerRouter