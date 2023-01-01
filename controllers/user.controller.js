const errorFormatter = require("../middleware/errorFormatter");
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
            const user = await findUserByEmail(email);
            if (!user) {
                return res.json({
                    "status": 401,
                    "message": "no user found!",
                    "error": {
                        "email": "email not exist!"
                    }
                })
            } else {
                const isPasswordValid = user.comparePassword(password, user.password);
                if (!isPasswordValid) {
                    return res.json({
                        "status": 403,
                        "message": "login failed!",
                        "error": {
                            "password": "password not match!"
                        }
                    })
                } else if (user.status === "block") {
                    return res.json({
                        "status": 403,
                        "message": "login failed!",
                        "error": {
                            "email": "your account is block!"
                        }
                    })
                } else if (user.status === "inactive") {
                    return res.json({
                        "status": 403,
                        "message": "login failed!",
                        "error": {
                            "email": "your account is not active!"
                        }
                    })
                } else {
                    const token = generateToken(user)
                    res.json({
                        status: 200,
                        message: "login successful!",
                        data: {
                            token, user: {
                                email: user.email,
                                id: user.id,
                                status: user.status,
                                role: user.role
                            }
                        }
                    })
                }

                // if (credential.role === "candidate") { 
                //     const candidate = await Candidate.findOne({userId: credential._id})
                //     if (candidate.status != "active") {
                //         return res.json({
                //             status: 403,
                //             message: "your account is block! try again later!",
                //         })
                //     }
                //     else {
                //         const token = generateToken(candidate)
                //         res.json({
                //             status: 200,
                //             message: "login successful",
                //             data: {
                //                 token, user:{
                //                     email: candidate.email,
                //                     id: candidate.id,
                //                     userId: candidate.userId,
                //                     status: candidate.status,
                //                     role: candidate.role
                //                 } 
                //             }
                //         })
                //     }
                // }
                // else if (credential.role === "hiringManager") {
                //     const hiringManager = await HiringManager.findOne({userId: credential._id})
                //     if (hiringManager.status != "active") {
                //         return res.json({
                //             status: 403,
                //             message: "your account is block! try again later!",
                //         })
                //     }
                //     else {
                //         const token = generateToken(hiringManager)
                //         res.json({
                //             status: 200,
                //             message: "login successful",
                //             data: {
                //                 token, user:{
                //                     email: hiringManager.email,
                //                     id: hiringManager.id,
                //                     userId: hiringManager.userId,
                //                     status: hiringManager.status,
                //                     role: hiringManager.role
                //                 } 
                //             }
                //         })
                //     }
                // } else {
                //     const admin = await Admin.findOne({userId: credential._id})
                //     if (admin?.status != "active") {
                //         return res.json({
                //             status: 403,
                //             message: "try again later!",
                //             "error":{
                //                 "email": "account is block!"
                //             }
                //         })
                //     }
                //     else {
                //         const token = generateToken(admin)
                //         res.json({
                //             status: 200,
                //             message: "login successful",
                //             data: {
                //                 token,  user:{
                //                     email: admin.email,
                //                     id: admin.id,
                //                     userId: admin.userId,
                //                     status: admin.status,
                //                     role: admin.role
                //                 } 
                //             }
                //         })
                //     }
                // }
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
module.exports.verifyMe = async (req, res, next) => {
    try {
        const user = await findUserByEmail(req.user?.email)
        const { password: pwd, ...others } = user.toObject();
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