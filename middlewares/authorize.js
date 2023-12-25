const jwt = require("express-jwt")
const User = require("../models/user.model")
const Role = require("../models/role.model")
const RefreshToken = require("../models/refreshToken.model")
const { secret } = require("../config/auth.config");
function authorize (func = "", permission = ""){
    
    return [
        jwt({ secret, algorithms: ["HS256"] }),
        async(req, res , next) => {
            try {
                const user = await User.findById(req.user.id)
                if(!user){
                    return res.status(401).json({ message: "Unauthorized" });
                }
                const roles = await Role.findOne({name: user.role});
                req.user.role = roles
                const refreshTokens = await RefreshToken.find({user: user.id})
                req.user.ownsToken = (token) => !!refreshTokens.find((x)=> x.token === token);
                next();
            } catch (error) {
                console.log(error);
                return res.status(500)
            }
        }
    ]
}

module.exports = authorize;