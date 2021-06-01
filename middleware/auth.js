// A middleware function is a function that has access to req,res obj

// I will be using auth middleware that will be enable me add it to the different routes 
// like logging in the user who has registered and is validated

// I used JWT in my auth file because i will be creating a new token everytime a user signs ins

const jwt = require("jsonwebtoken");
const config = require("config");

// export the middleware function that has res and req obj to it
module.exports = function (req, res, next) {

  // Get token from header ==> "x-auth-token"
  const token = req.header("x-auth-token");

  // if no token return errorS
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
