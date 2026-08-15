import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { expressjwt } from "express-jwt";
import config from "./../../config/config.js";
const signin = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(401).json({ error: "User not found" });
    if (!user.authenticate(req.body.password)) {
      return res.status(401).send({ error: "Email and password don't match." });
    }
    if (user.needsPasswordUpgrade()) {
      user.password = req.body.password;
      await user.save();
    }
    const token = jwt.sign({ _id: user._id }, config.jwtSecret, { expiresIn: "7d" });
    return res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || "user",
      },
    });
  } catch (err) {
    return res.status(401).json({ error: "Could not sign in" });
  }
};
const signout = (req, res) => {
  return res.status(200).json({
    message: "signed out",
  });
};
const requireSignin = expressjwt({
  secret: config.jwtSecret,
  algorithms: ["HS256"],
  userProperty: "auth",
});
const hasAuthorization = (req, res, next) => {
  const authorized = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!authorized) {
    return res.status(403).json({
      error: "User is not authorized",
    });
  }
  next();
};
const requireAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.auth._id).select("role");
    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Admin access is required" });
    }
    next();
  } catch {
    return res.status(403).json({ error: "Admin access is required" });
  }
};
export default { signin, signout, requireSignin, hasAuthorization, requireAdmin };
