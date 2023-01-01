const express = require("express");
const { getApplicationByCandidate, getAppDetailsById, updateApplicationById, deleteApplication } = require("../controllers/application.Controller");
const authentication = require("../middleware/authentication");
const authorization = require("../middleware/authorization");
const candidateRoute = express.Router();

candidateRoute.route("/application")
.get(authentication, authorization("candidate"),getApplicationByCandidate)

candidateRoute.route("/application/:id")
.get(authentication, authorization("candidate"),getAppDetailsById)
.patch(authentication, authorization("candidate"),updateApplicationById)
.delete(authentication, authorization("candidate"),deleteApplication)


module.exports = candidateRoute