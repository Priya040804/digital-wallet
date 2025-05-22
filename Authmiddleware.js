const User = require("../Models/UserModel");
require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.userVerification = (req, res,next) => {
  const token = req.cookies.token
  if (!token) {
    return res.json({ status: false })
  }
  jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
    if (err) {
     return res.status(401).json({ status: false, message: "Unauthorized" }) 
    } else {
      try {
        const user = await User.findById(data.id);
        if (!user) return res.status(401).json({ status: false });
        req.user = user;
        next();
      } catch (err) {
        return res.status(500).json({ status: false, error: "Server error" });
      }      
    }
  });
}

module.exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res.status(403).json({ message: "Forbidden" });
  }
};