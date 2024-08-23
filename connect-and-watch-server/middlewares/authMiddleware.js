const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/jwtConfig");

const authMiddleware = (req, res, next) => {
  // Check if Authorization header is present
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    // If no Authorization header, skip the middleware
    return next();
  }

  const token = authHeader.split(" ")[1];

  // Check if no token is provided
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error("Token verification failed:", err.message);
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = authMiddleware;
