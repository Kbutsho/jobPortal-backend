const express = require("express");
const {
    signUpController,
    loginController,
    getUser
} = require("../controllers/user.controller");
const userRouter = express.Router();

userRouter.route('/signup')
    .post(signUpController)
userRouter.route('/login')
    .post(loginController)
userRouter.route('/all')
    .get(getUser)

module.exports = userRouter