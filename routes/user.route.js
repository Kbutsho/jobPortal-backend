const express = require("express");
const {
    signUpController,
    loginController,
    verifyMe
} = require("../controllers/user.controller");
const authentication = require("../middleware/authentication");
const userRouter = express.Router();

userRouter.route('/signup')
    .post(signUpController)
userRouter.route('/login')
    .post(loginController)

userRouter.route('/me')
    .get(authentication, verifyMe)


module.exports = userRouter