// A middleware function is a function that has access to req,res obj
//

const jwt = require("jsonwebtoken");
const config = require("config");

// export the middleware function that has res and req obj to it
module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header("x-auth-token");

  // if no token return error
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization has failed" });
  }

  // Decode token passed through and verify it
  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is NOT Valid" });
  }
};
