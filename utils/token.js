const jwt = require('jsonwebtoken');
exports.generateToken = (userInfo) =>{
    const payLoader = {
        id: userInfo.id,
        email: userInfo.email,
        role: userInfo.role,
    };
    const token = jwt.sign(payLoader, process.env.TOKEN_SECRET, {
        expiresIn: "7days"
    })
    return token
}