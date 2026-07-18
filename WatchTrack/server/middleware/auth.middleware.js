const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/config");

// Verifies the token sent in the Authorization header ("Bearer <token>")
exports.requireSignin = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.auth = decoded; // { _id, name, email, role }
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

// Only allows the resource owner (or an admin) to continue
exports.hasAuthorization = (req, res, next) => {
  const authorized =
    req.resourceOwnerId &&
    req.auth &&
    (req.resourceOwnerId.toString() === req.auth._id || req.auth.role === "admin");

  if (!authorized) {
    return res.status(403).json({ error: "User is not authorized to perform this action" });
  }
  next();
};