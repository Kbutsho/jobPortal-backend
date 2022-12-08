const jwt = require('jsonwebtoken');
const {promisify} = require("util");
const User = require('../models/User.model');
module.exports = async (req, res, next)=>{
    try {
        const token = req.headers?.authorization?.split(" ")?.[1]
        if(!token){
            res.locals.user = null;
            return res.json({
                status: 401,
                "message": "access denied!",
                error: "login first!"
            })
        }
        const decoded = await promisify(jwt.verify)(token, process.env.TOKEN_SECRET)
        req.user = decoded
        // console.log(decoded)
        let user = await User.findById(decoded._id)
        res.locals.user = user;
        next()
    } catch (error) {
        res.locals.user = null;
        res.json({
            status: 403,
            "error" : "invalid token!"
        })
    }
}