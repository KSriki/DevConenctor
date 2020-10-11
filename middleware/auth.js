// custom auth for protected routes using jwt token
const jwt = require("jsonwebtoken");
const config = require("config");

// middleware function that has access to request and response
module.exports = function (req, res, next) {
  // get token from header for the protected route
  const token = req.header("x-auth-token");

  // check if no token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  // verify token
  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    req.user = decoded.user; // user in the payload (then id)
    next(); // go to next middleware
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
