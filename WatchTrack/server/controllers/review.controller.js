import Review from "../models/review.model.js";
import extend from "lodash/extend.js";
import errorHandler from "./error.controller.js";

const create = async (req, res) => {
  const review = new Review(req.body);
  review.movie = req.movie._id;
  review.user = req.auth._id;
  try {
    await review.save();
    return res.status(200).json(review);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        error: "You have already reviewed this movie",
      });
    }
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const listByMovie = async (req, res) => {
  try {
    let reviews = await Review.find({ movie: req.movie._id })
      .populate("user", "name")
      .sort({ created: -1 });
    res.json(reviews);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const reviewByID = async (req, res, next, id) => {
  try {
    let review = await Review.findById(id);
    if (!review)
      return res.status(400).json({
        error: "Review not found",
      });
    req.review = review;
    next();
  } catch (err) {
    return res.status(400).json({
      error: "Could not retrieve review",
    });
  }
};

const read = (req, res) => {
  return res.json(req.review);
};

const update = async (req, res) => {
  try {
    let review = req.review;
    const updates = {
      ...(req.body.rating !== undefined && { rating: req.body.rating }),
      ...(req.body.comment !== undefined && { comment: req.body.comment }),
    };
    review = extend(review, updates);
    review.updated = Date.now();
    await review.save();
    res.json(review);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const remove = async (req, res) => {
  try {
    let review = req.review;
    let deletedReview = await review.deleteOne();
    res.json(deletedReview);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

// Only the review's author can edit/delete it
const isOwner = (req, res, next) => {
  const authorized =
    req.review && req.auth && req.review.user.toString() === req.auth._id;
  if (!authorized) {
    return res.status(403).json({
      error: "User is not authorized",
    });
  }
  next();
};

export default {
  create,
  listByMovie,
  reviewByID,
  read,
  update,
  remove,
  isOwner,
};
