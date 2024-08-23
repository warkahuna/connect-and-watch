module.exports = {
  jwtSecret: process.env.JWT_SECRET || "connect&watch",
  jwtExpire: "24h", // Token expiration time
};
