module.exports = (...role)=>{
    return (req, res, next)=>{
        const userRole = req.user.role;
        if(!role.includes(userRole)){
            return res.json({
                status: 403,
                "message": "access denied!",
                error: "not authorized user!"
            })
        }
        next()
    }
}