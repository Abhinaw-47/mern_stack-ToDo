const jwt = require("jsonwebtoken");
require("dotenv").config();


const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  const jwt_password = process.env.JWT_PASSWORD;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const actualToken = token.split(" ")[1];
  // console.log(actualToken);
  jwt.verify(actualToken, jwt_password, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden: Invalid token" });
    }
    req.user = decoded;
    // console.log("Req.user - " + JSON.stringify(req.user));
    next();
  });
};

module.exports = verifyToken;