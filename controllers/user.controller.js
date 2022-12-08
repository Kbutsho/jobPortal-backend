const errorFormatter = require("../middleware/errorFormatter");
const Admin = require("../models/Admin.model");
const Candidate = require("../models/Candidate.model");
const HiringManager = require("../models/HiringManager.model");
const { signupService, findUserByEmail } = require("../services/user.service");
const { generateToken } = require("../utils/token");

exports.signUpController = async (req, res) => {
    try {
        await signupService(req.body);
        res.json({
            "status": 200,
            "message": "registration successful!",
        })
    } catch (error) {
        res.json({
            "status": 400,
            "message": "registration failed!",
            "error": errorFormatter(error.message)
        })
    }
}
exports.loginController = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email && !password) {
            return res.json({
                "status": 401,
                "message": "login failed!",
                "error": {
                    "email": "email is required!",
                    "password": "password is required!"
                }
            })
        }
        else if (!email) {
            return res.json({
                "status": 401,
                "message": "login failed!",
                "error": {
                    "email": "email is required!"
                }
            })
        }
        else if (!password) {
            return res.json({
                "status": 401,
                "message": "login failed!",
                "error": {
                    "email": "password is required!"
                }
            })
        }
        else {
            const credential = await findUserByEmail(email);
            if (!credential) {
                return res.json({
                    "status": 401,
                    "message": "no user found!",
                    "error": {
                        "email": "email not exist!"
                    }
                })
            } else {
                const isPasswordValid = credential.comparePassword(password, credential.password);
                if (!isPasswordValid) {
                    return res.json({
                        "status": 403,
                        "message": "password not match!",
                        "error": {
                            "password": "password not match!"
                        }
                    })
                }
                if (credential.role === "candidate") { 
                    const candidate = await Candidate.findOne({userId: credential._id})
                    if (candidate.status != "active") {
                        return res.json({
                            status: 403,
                            message: "your account is block! try again later!",
                        })
                    }
                    else {
                        const token = generateToken(candidate)
                       
                        res.json({
                            status: 200,
                            message: "login successful",
                            data: {
                                token, user:{
                                    email: candidate.email,
                                    id: candidate.id,
                                    userId: candidate.userId,
                                    status: candidate.status,
                                    role: candidate.role
                                } 
                            }
                        })
                    }
                }
                else if (credential.role === "hiringManager") {
                    const hiringManager = await HiringManager.findOne({userId: credential._id})
                    if (hiringManager.status != "active") {
                        return res.json({
                            status: 403,
                            message: "your account is block! try again later!",
                        })
                    }
                    else {
                        const token = generateToken(hiringManager)
                        res.json({
                            status: 200,
                            message: "login successful",
                            data: {
                                token, user:{
                                    email: hiringManager.email,
                                    id: hiringManager.id,
                                    userId: hiringManager.userId,
                                    status: hiringManager.status,
                                    role: hiringManager.role
                                } 
                            }
                        })
                    }
                } else {
                    const admin = await Admin.findOne({userId: credential._id})
                    if (admin?.status != "active") {
                        return res.json({
                            status: 403,
                            message: "try again later!",
                            "error":{
                                "email": "account is block!"
                            }
                        })
                    }
                    else {
                        const token = generateToken(admin)
                        res.json({
                            status: 200,
                            message: "login successful",
                            data: {
                                token,  user:{
                                    email: admin.email,
                                    id: admin.id,
                                    userId: admin.userId,
                                    status: admin.status,
                                    role: admin.role
                                } 
                            }
                        })
                    }
                }
            }
        }
    } catch (error) {
        res.json({
            status: 400,
            message: "failed",
            error: error.message
        })
    }
}
module.exports.verifyMe = async (req, res, next)=>{
    try {
        const user = await findUserByEmail(req.user?.email)
        const {password: pwd, ...others} = user.toObject();
        res.json({
            status: 200,
            data: {
                user: others
            }
        })
    } catch (error) {
        res.json({
            status: 500,
            error: error.message
        })
    }
}