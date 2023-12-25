const User = require("../models/user.model")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const config = require("../config/auth.config");
const RefreshToken = require("../models/refreshToken.model")
function basicDetails(user) {
    const { id, name,email, username, role, avatar } = user;
    return { id, name,email, username, role, avatar };
  }
  function generateJwtToken(user) {
    // create a jwt token containing the user id that expires in 15 minutes (mới set lại 360 phút)
    return jwt.sign({ sub: user._id, id: user._id }, config.secret, {
      expiresIn: "360m",
    });
  }
  function randomTokenString() {
    return crypto.randomBytes(64).toString("hex");
  }

  function generateRefreshToken(user, ipAddress) {
    // create a refresh token that expires in 7 days
    return new RefreshToken({
      user: user.id,
      token: randomTokenString(),
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      createdByIp: ipAddress,
    });
  }
async function authenticate({ username, password, ipAddress }) {
    const user = await User.findOne({ username : username }).populate("role");
    if(user.emailVeryfied === false){
      return {
        status: 0,
        message: "Tài khoản chưa được kích hoạt",
      };
    }
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return {
        status: 0,
        message: "Username or password is incorrect",
      };
    }
    // authentication successful so generate jwt and refresh tokens
    const jwtToken = generateJwtToken(user);
    const refreshToken = generateRefreshToken(user, ipAddress);
    
    // save refresh token
    await refreshToken.save();
    return {
      ...basicDetails(user),
      status: 1,
      jwtToken,
      refreshToken: refreshToken.token,
    };
    
  }



module.exports = {
    authenticate,
    randomTokenString
}