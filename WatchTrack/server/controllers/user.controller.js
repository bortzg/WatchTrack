import User from "../models/user.model.js";
import extend from "lodash/extend.js";
import errorHandler from "./error.controller.js";
import Movie from "../models/movie.model.js";
import Review from "../models/review.model.js";
const create = async (req, res) => {
  // Never accept a role from public registration.
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  try {
    await user.save();
    return res.status(200).json({
      message: "Successfully signed up!",
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};
const list = async (req, res) => {
  try {
    const users = await User.find().select("name role updated created");
    res.json(
      users.map((user) => ({
        ...user.toObject(),
        role: user.role || "user",
      }))
    );
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};
const userByID = async (req, res, next, id) => {
  try {
    let user = await User.findById(id);
    if (!user)
      return res.status(400).json({
        error: "User not found",
      });
    req.profile = user;
    next();
  } catch (err) {
    return res.status(400).json({
      error: "Could not retrieve user",
    });
  }
};
const read = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  if (!req.profile.role) req.profile.role = "user";
  return res.json(req.profile);
};
const update = async (req, res) => {
  try {
    let user = req.profile;
    const allowedFields = ["name", "email", "password"];
    const updates = Object.fromEntries(
      Object.entries(req.body).filter(([key]) => allowedFields.includes(key))
    );
    user = extend(user, updates);
    user.updated = Date.now();
    await user.save();
    user.hashed_password = undefined;
    user.salt = undefined;
    res.json(user);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};
const remove = async (req, res) => {
  try {
    let user = req.profile;
    const movieIds = await Movie.find({ createdBy: user._id }).distinct("_id");
    await Review.deleteMany({ $or: [{ user: user._id }, { movie: { $in: movieIds } }] });
    await Movie.deleteMany({ createdBy: user._id });
    let deletedUser = await user.deleteOne();
    deletedUser.hashed_password = undefined;
    deletedUser.salt = undefined;
    res.json(deletedUser);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};
export default { create, userByID, read, list, remove, update };
