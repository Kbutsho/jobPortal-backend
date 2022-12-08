const express = require("express")
const { getAllCandidate, getCandidateById, getAllManager } = require("../controllers/admin.controller");
const authorization = require('../middleware/authorization');
const authentication = require("../middleware/authentication");
const adminRouter = express.Router()

adminRouter.route('/candidates')
.get(authentication, authorization("admin"), getAllCandidate)

adminRouter.route('/candidate')
.get(authentication, authorization("admin"), getCandidateById)

adminRouter.route('/managers')
.get(authentication, authorization("admin"), getAllManager)

module.exports = adminRouter;